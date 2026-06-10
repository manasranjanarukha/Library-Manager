// React
import React from "react";

// Icons
import { BookOpen } from "lucide-react";
export default function BookDetailsAbout({ book }) {
  const { description } = book;
  return (
    <div>
      <section
        className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm fade-up"
        style={{ animationDelay: "80ms" }}
        aria-label="About this book"
      >
        <div className="flex gap-0">
          <div
            className="w-1 flex-shrink-0 bg-teal-700 rounded-l-2xl"
            aria-hidden="true"
          />
          <div className="flex-1 p-5 sm:p-6 lg:p-7">
            <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              <BookOpen className="h-4 w-4 text-teal-600" aria-hidden="true" />
              About This Book
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base lg:text-[15px] lg:leading-loose">
              {description}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
