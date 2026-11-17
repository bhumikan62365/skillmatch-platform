import React, { useRef, useState } from 'react';
import { FileUp, FileCheck2, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  isProcessing?: boolean;
  currentFileName?: string;
  accept?: string;
}

export function UploadZone({
  onFileSelected,
  isProcessing = false,
  currentFileName,
  accept = '.pdf,.docx,.doc,.txt',
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndEmit = (file: File) => {
    setError(null);
    const allowed = ['pdf', 'docx', 'doc', 'txt'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowed.includes(ext)) {
      setError('Unsupported file format. Upload a PDF or DOCX resume.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File exceeds 10 MB limit.');
      return;
    }
    onFileSelected(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) validateAndEmit(file);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          isDragging
            ? 'border-[#2563EB] bg-blue-50/50'
            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50/60'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) validateAndEmit(file);
          }}
        />
        <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
          {currentFileName && !isProcessing ? (
            <FileCheck2 className="w-6 h-6" aria-hidden="true" />
          ) : (
            <FileUp className="w-6 h-6" aria-hidden="true" />
          )}
        </div>
        <h3 className="mt-4 text-sm font-semibold text-[#0F172A] font-display">
          {isProcessing
            ? 'Extracting education, skills, and project evidence...'
            : 'Drag and drop your resume here, or click to browse'}
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Supports PDF and DOCX up to 10 MB
          {currentFileName ? ` · Last uploaded: ${currentFileName}` : ''}
        </p>
      </div>
      {error && (
        <div className="mt-2.5 flex items-center gap-2 text-xs text-rose-600">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
