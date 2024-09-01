import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/ui/sheet";
import { Input } from "../ui/ui/input";
import { useState } from "react";
import { shareSheet } from "@/lib/api/sheet";
import { ShareIcon } from "lucide-react";
const ShareSheet = ({ sheetId }) => {
  const [userName, setUserName] = useState("");
  const [permission, setPermission] = useState("");
  const handlePermissionChange = (event) => {
    setPermission(event.target.value);
  };
  const handleShare = async () => {
    try {
        console.log(sheetId,userName, permission);
      await shareSheet(sheetId, userName, permission);

      alert("Sheet shared successfully");
    } catch (error) {
      console.error("Error sharing sheet:", error);
      alert("Failed to share the sheet.");
    }
  };
  return (
    <div>
      <Sheet>
        <div className="flex items-center gap-2">
        <SheetTrigger className="text-l">Share</SheetTrigger>
        <ShareIcon/>
        </div>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-gray-200">
              Share the sheet with another user
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="my-4">
            <Input
              type="text"
              className="border-[0.5px] border-white text-gray-300"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              placeholder="Enter Username"
            />
          </div>
          <div>
            <span className="block text-sm font-medium text-foreground text-green-400">
              Permissions
            </span>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="permissions"
                  value="edit"
                  checked={permission === "edit"}
                  onChange={handlePermissionChange}
                  className="form-checkbox h-4 w-4 text-gray-200 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-sm text-foreground text-gray-200">
                  Edit
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="permissions"
                  value="read-only"
                  checked={permission === "read-only"}
                  onChange={handlePermissionChange}
                  className="form-checkbox h-4 w-4 text-gray-200 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-sm text-foreground text-gray-200">
                  Read Only
                </span>
              </label>
            </div>
          </div>

          <button
            className="px-6 py-2 border-solid border-[0.5px] text-white mt-4"
            onClick={handleShare}
          >
            Share
          </button>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ShareSheet;
