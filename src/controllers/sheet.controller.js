import { Sheet } from "../models/sheet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";


const createSheet = asyncHandler(async(req,res) => {
    const{owner} = req.body;
    console.log(req.body);
    const initialData = Array.from({ length: 15 }, () => Array(26).fill(''));
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
            break;
        case 'deleteRow':
            
            if (rowIndex >= 0 && rowIndex < sheet.data.length) {
                sheet.data.splice(rowIndex, 1);
            }
            break;
        case 'addColumn':
            
        sheet.data = sheet.data.map((row, index) => {
            if (Array.isArray(row)) {
                row.push(''); // Add an empty column
            } else {
                console.error(`Row ${index} is not an array. Current value:`, row);
                // Attempt to fix the row structure by converting it to an array
                if (typeof row === 'object' && row !== null) {
                    row = Object.values(row); // Convert object to array
                    row.push(''); // Add the new column
                } else {
                    throw new ApiError(500, `Row ${index} is not an array or an object. Unable to add column.`);
                }
            }
            return row;
        });
        break;
        case 'deleteColumn':
            
            if (columnIndex >= 0 && columnIndex < sheet.data[0].length) {
                sheet.data.forEach(row => row.splice(columnIndex, 1));
            }
            break;
        case 'updateData':
            
            sheet.data = data;
            break;
        default:
            throw new ApiError(400, "Invalid operation");
    }

    await sheet.save();
    return res.status(200).json(
        new ApiResponse(200,sheet,"Sheet Updated Successfully")
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
    const {username,permission} = req.body;

    if (typeof username === 'string') {
        username = [username]; 
    }
    if (!Array.isArray(username) || username.length === 0) {
        throw new ApiError(400, "Invalid usernames");
    }
    const userIds = await findUserIdsByNames(username);
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
    const users = await User.find({ username: { $in: userNames } });
    if (users.length === 0) {
        throw new ApiError(404, "No users found");
    }
    return users.map(user => user._id);
};
export {createSheet,getAllSheets,getSingleSheet,UpdateSheet,DeleteSheet,ShareSheet};