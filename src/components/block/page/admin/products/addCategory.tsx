"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (categoryName: string) => void;
};

function AddCategoryModal(props: Props) {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = () => {
    // Call the onSubmit prop with the category name
    props.onSubmit(categoryName);
    // TODO: notification success
    
    // Reset the input field
    setCategoryName("");
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category Name"
              className="border border-gray-300 rounded-md px-3 py-2 mb-3"
            />
            <Button color="primary" onClick={handleSubmit}>Submit</Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddCategoryModal;
