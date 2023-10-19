"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Icons } from "./ui/icons";
import { Button } from "./ui/button";
import { Document, Page } from "react-pdf";
import { useToast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";

interface PdfFullscreenProps {
  url: string;
}

export default function PdfFullsreen({ url }: PdfFullscreenProps) {
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();
  const [isOpen, setIsOpen] = useState(false);
  const [pages, setPages] = useState<number | undefined>(undefined);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isVisible) => {
        if (!isVisible) {
          setIsOpen(isVisible);
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button aria-label="fullscreen" variant="ghost" size="sm">
          <Icons.expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Icons.spinner className="animate-spin my-24 h-6 w-6" />
                </div>
              }
              onLoadSuccess={({ numPages }) => setPages(numPages)}
              onLoadError={() => {
                toast({
                  title: "Error loading PDF",
                  description: "Please try again later.",
                  variant: "destructive",
                });
              }}
              className="max-h-full"
              file={url}
            >
              {new Array(pages).fill(0).map((_, index) => (
                <Page
                  key={index}
                  pageNumber={index + 1}
                  width={width ? width : 1}
                  className="border border-border shadow-md mb-4 lg:mb-8"
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
}
