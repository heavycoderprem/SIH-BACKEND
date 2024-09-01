import { Sheet } from "../models/sheet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";


const createSheet = asyncHandler(async(req,res) => {
    const {owner} = req.body;
    console.log("Received owner ID in backend:", req.body);
    if (!owner || !mongoose.Types.ObjectId.isValid(owner)) {
        throw new ApiError(400, "Invalid or missing owner ID");
    }

    const columns = Array.from({ length: 26 }, (_, index) => {
        const letter = String.fromCharCode(65 + index); 
        return { headerName: letter, field: letter, editable: true };
    });

    const initialData = Array.from({ length: 15 }, () => {
        return columns.reduce((acc, col) => {
            acc[col.field] = ''; 
            return acc;
        }, {});
    });
    const newSheet = new Sheet({owner, data: initialData});
    if(!newSheet) {
        throw new ApiError(500, "Something went wrong while creating new sheet")
    }
    await newSheet.save();
    return res.status(201).json(
        new ApiResponse(200,newSheet,"Sheet created successfully")
    )



})

const getAllSheets = asyncHandler(async(req,res) => {
    const {userId} = req.params;
    console.log(userId);
    const ownedSheetsPromise = await Sheet.find({owner: userId});
    const user = await User.findById(userId).populate('sharedSheets.sheetId');
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const sharedSheets = user.sharedSheets;
    const [ownedSheets] = await Promise.all([ownedSheetsPromise]);
    const allSheets = [...ownedSheets, ...sharedSheets.map(shared => shared.sheetId)];
    if (allSheets.length === 0) {
        throw new ApiError(404, "No sheets found for this user");
    }


    return res.status(200).json(
        new ApiResponse(200,allSheets,"Sheets retrieved successfully")
    )

})

const getSingleSheet = asyncHandler(async(req,res) => {
    const {sheetId} = req.params;
    const sheet = await Sheet.findById(sheetId);
    if(!sheet) {
        throw new ApiError(404, "Sheet not found")
    }

    return res.status(200).json(
        new ApiResponse(200,sheet,"Sheet retrieved successfully")
    )

})

const UpdateSheet = asyncHandler(async(req,res) => {
    const {sheetId} = req.params;
    const {data,operation,rowIndex,columnIndex} = req.body;
    const userId = req.user.id;
    
    const sheet = await Sheet.findById(sheetId)
    if(!sheet) {
        throw new ApiError(500, "Problem while finding sheet to update")
    }
    const user = await User.findById(userId);
    const sharedSheet = user.sharedSheets.find(shared => shared.sheetId.equals(sheetId));
    if (sharedSheet && sharedSheet.permission !== 'edit') {
        throw new ApiError(403, "You do not have permission to edit this sheet");
    }

    switch (operation) {
        case 'addRow':
            
            sheet.data.push(Array(sheet.data[0].length).fill(''));
            await sheet.save();
            console.log(sheet.data.length);
            break;
        case 'deleteRow':
            
            if (rowIndex >= 0 && rowIndex < sheet.data.length) {
                sheet.data.splice(rowIndex, 1);
            }
            console.log(sheet.data.length);
            await sheet.save();
            break;
        case 'addColumn':
            
        sheet.data = sheet.data.map((row, index) => {
            if (Array.isArray(row)) {
                row.push(''); 
            } else {
                console.error(`Row ${index} is not an array. Current value:`, row);
                
                if (typeof row === 'object' && row !== null) {
                    row = Object.values(row); 
                    row.push(''); 
                } else {
                    throw new ApiError(500, `Row ${index} is not an array or an object. Unable to add column.`);
                }
            }
            return row;
        });
        break;
        case 'deleteColumn':
            
            if (columnIndex >= 0 && columnIndex < sheet.data[0].length) {
                sheet.data = sheet.data.map(row => {
                    if (Array.isArray(row)) {
                        row.splice(columnIndex, 1); 
                        return row;
                    } else {
                       
                        if (typeof row === 'object' && row !== null) {
                            const rowArray = Object.values(row);
                            rowArray.splice(columnIndex, 1);
                            return rowArray;
                        } else {
                            throw new ApiError(500, "Row structure is inconsistent. Unable to delete column.");
                        }
                    }
                    
                });
            } else {
                throw new ApiError(400, "Invalid column index");
            }

            
            break;
        case 'updateData':
            
            sheet.data = data;
            await sheet.save();
            break;
        default:
            throw new ApiError(400, "Invalid operation");
    }

    await sheet.save();
    return res.status(200).json(
        new ApiResponse(200,sheet,"Sheet Updated Successfully")
    )

})
const updateName = asyncHandler(async(req,res) => {
    const {sheetId} = req.params;
    const {newName } = req.body;

    if(!sheetId || !newName) {
        throw new ApiError(400,"SheetID and name are required")
    }
    
    const sheet = await Sheet.findByIdAndUpdate(sheetId,
        {
            $set: {
                name: newName
            }
        },
        {
            new: true
        }
    )
    if(!sheet) {
        throw new ApiError(404,"Sheet not found")
    }

    return res.status(200).json(
        new ApiResponse(200,sheet,"Name updated successfully")
    )

})
const DeleteSheet = asyncHandler(async(req,res) => {
    const {sheetId} = req.params;
    const sheet = await Sheet.findByIdAndDelete(sheetId);
    if(!sheet) {
        throw new ApiError(404, "Sheet not found")
    }

    return res.status(200).json(
        new ApiResponse(200,null,"Sheet Deleted successfully")
    )

})

const ShareSheet = asyncHandler(async(req,res) => {
    const {sheetId} = req.params;
    const {userNames,permission} = req.body;
    console.log("credentials" ,req.body);
    if (!userNames) {
        throw new ApiError(400, "Username is required");
    }
    const usernamesArray = Array.isArray(userNames) ? userNames : [userNames];
    if (!usernamesArray || usernamesArray.length === 0) {
        throw new ApiError(400, "Invalid usernames");
    }
    const userIds = await findUserIdsByNames(usernamesArray);
    const sheet = await Sheet.findById(sheetId);

    if(!sheet) {
        throw new ApiError(400,"Sheet not found")
    }

    if(!sheet.shared_with) {
        sheet.shared_with = [];
    }

    userIds.forEach(userId => {
        if (!sheet.shared_with.includes(userId)) {
            sheet.shared_with.push(userId);
        }
    });

    await sheet.save();

    await User.updateMany(
        { _id: { $in: userIds } },
        { $addToSet: { sharedSheets: { sheetId, permission } } }
    );

    return res.status(200).json(
        new ApiResponse(200,sheet,"Sheet shared successfully")
    )




})

const findUserIdsByNames = async (userNames) => {
    const users = await User.find({ 
        username: { 
            $in: userNames.map(name => new RegExp(`^${name}$`, 'i')) 
        } 
    });

    if (users.length === 0) {
        throw new ApiError(404, "No users found");
    }
    return users.map(user => user._id);
};
export {createSheet,getAllSheets,getSingleSheet,UpdateSheet,DeleteSheet,ShareSheet,updateName};