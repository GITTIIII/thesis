import React from "react";
import { Button } from "../ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold">ยืนยันการลบสาขา</h2>
        <p>คุณยืนยันที่จะลบสาขานี้?</p>
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button onClick={onConfirm}>ลบ</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
