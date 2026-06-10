import { FileText, AlertCircle } from "lucide-react";
export default function PdfUpload({ file, pages, error, onChange }) {
  const fileName =
    file instanceof File ? file.name : file ? "Existing file" : null;

  return (
    <div className="flex flex-col gap-2">
      {fileName ? (
        /* Chosen state */
        <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-[#0F766E]/20 bg-[#0F766E]/5">
          <FileText
            className="w-5 h-5 text-[#0F766E] flex-shrink-0"
            aria-hidden="true"
          />
          <span className="flex-1 text-sm text-[#1E293B] font-medium truncate min-w-0">
            {fileName}
          </span>
          {pages && (
            <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20">
              {pages} pp.
            </span>
          )}
        </div>
      ) : (
        /* Empty upload zone */
        <label
          htmlFor="bookFile"
          className="flex flex-col items-center gap-2 px-4 py-5 rounded-xl border-1 border-black bg-slate-50 hover:border-[#0F766E]/40 hover:bg-[#0F766E]/3 transition-all duration-200 cursor-pointer"
          aria-label="Upload book PDF file"
        >
          <FileText className="w-7 h-7 text-[#94A3B8]" aria-hidden="true" />
          <p className="text-sm font-semibold text-black">Upload PDF</p>
          <p className="text-[11px] text-black">
            Pages auto-detected · Max 10 MB
          </p>
        </label>
      )}

      <input
        id="bookFile"
        type="file"
        name="bookFile"
        accept="application/pdf"
        onChange={onChange}
        className="sr-only"
        aria-invalid={error ? "true" : "false"}
      />

      {fileName && (
        <label
          htmlFor="bookFile"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#64748B] hover:border-[#0F766E]/30 hover:text-[#0F766E] transition-all duration-200 cursor-pointer active:scale-95"
        >
          <FileText className="w-3.5 h-3.5" aria-hidden="true" />
          Replace PDF
        </label>
      )}

      {error && (
        <p
          role="alert"
          className="flex items-center gap-1 text-xs text-[#DC2626] font-medium"
        >
          <AlertCircle className="w-3 h-3" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
