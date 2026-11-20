"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Link2 } from 'lucide-react';
import { useTree } from '@/providers/TreeProvider';

const ConnectPersonModal = () => {
  const {
    toggleConnectPersonModal,
    handleConnectPersonToUser
  } = useTree();
  const [userId, setUserId] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleConnectPersonToUser(userId);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-10">
      <motion.form
        initial={{ y: -16, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -12, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[#faf9f7] w-[95%] max-w-[380px] rounded-2xl shadow-2xl shadow-stone-900/20 border border-stone-200/60"
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-stone-200/70">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#D4F3C0]/60 flex items-center justify-center">
                <Link2 size={13} className="text-[#1B5A1B]" />
              </div>
              <span className="text-xs uppercase tracking-widest text-stone-400 font-medium">Family Tree</span>
            </div>
            <h2 className="text-base font-semibold text-stone-800 mt-0.5">Connect Person to User</h2>
            <p className="text-xs text-stone-400 leading-relaxed">
              Link this family member to an existing account using their User ID.
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleConnectPersonModal()}
            className="mt-0.5 w-7 h-7 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
              User ID
            </label>
            <input
              type="text"
              placeholder="Enter User ID"
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 bg-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-[#1B5A1B]/40 focus:bg-white transition-colors duration-150"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoFocus
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => toggleConnectPersonModal()}
              className="flex-1 py-2.5 rounded-xl border border-[#1B5A1B]/30 text-[#1B5A1B] text-sm font-medium hover:bg-[#D4F3C0]/40 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#1B5A1B] hover:bg-[#34762E] text-white text-sm font-medium transition-colors duration-150 flex items-center justify-center gap-1.5"
            >
              <Link2 size={13} />
              Connect
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default ConnectPersonModal;
