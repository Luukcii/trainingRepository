// Turns rule text into words plus tappable glossary terms. Works in server and client components.
import { Fragment } from "react";
import { parseMarkup } from "@/lib/war/markup";
import { findTerm } from "@/content/war/glossary";
import { Term } from "./Term";

export function RichText({ text }: { text: string }) {
  return (
    <>
      {parseMarkup(text).map((piece, i) =>
        "text" in piece ? (
          <Fragment key={i}>{piece.text}</Fragment>
        ) : (
          <Term key={i} id={piece.term}>
            {piece.label || findTerm(piece.term)?.term || piece.term}
          </Term>
        ),
      )}
    </>
  );
}
