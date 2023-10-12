"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { Icons } from "./ui/icons";
import { useToast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import SimpleBar from "simplebar-react";
import PdfFullsreen from "./PdfFullscreen";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();
  const [pages, setPages] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState(1);
  const [renderScale, setRenderScale] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  const isLoading = renderScale !== scale;

  const pageSchema = z.object({
    page: z
      .string()
      .refine((pageNum) => Number(pageNum) > 0 && Number(pageNum) <= pages!),
  });

  type PageSchemaValidator = z.infer<typeof pageSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PageSchemaValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(pageSchema),
  });

  function handlePageSubmit({ page }: PageSchemaValidator) {
    setCurrentPage(Number(page));
    setValue("page", String(page));
  }

  return (
    <div className="w-full bg-background rounded-md flex flex-col items-center">
      <header className="h-14 w-full border-b border-border flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            aria-label="previous page"
            variant="ghost"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => {
              setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
              setValue("page", String(currentPage - 1));
            }}
          >
            <Icons.chevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              className={cn(
                "w-8 h-6",
                errors.page && "focus-visible:ring-destructive"
              )}
              {...register("page")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className="text-foreground/80 text-sm space-x-1">
              <span>/</span>
              <span>{pages}</span>
            </p>
          </div>
          <Button
            disabled={pages === undefined || currentPage === pages}
            aria-label="next page"
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentPage((prev) => (prev + 1 > pages! ? pages! : prev + 1));
              setValue("page", String(currentPage + 1));
            }}
          >
            <Icons.chevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-x-2 ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="zoom"
                variant="ghost"
                size="sm"
                className="gap-1.5"
              >
                <Icons.search className="w-4 h-4" />
                {scale * 100}%
                <Icons.chevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-fit">
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setScale(1)}
              >
                100%
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setScale(1.5)}
              >
                150%
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setScale(2)}
              >
                200%
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setScale(2.5)}
              >
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            aria-label="rotate 90 degrees"
            variant="ghost"
            size="sm"
            onClick={() => setRotation((prev) => prev + 90)}
          >
            <Icons.rotate className="h-4 w-4" />
          </Button>
          <PdfFullsreen url={url} />
        </div>
      </header>

      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)">
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
              {isLoading && renderScale ? (
                <Page
                  width={width ? width : 1}
                  pageNumber={currentPage}
                  scale={scale}
                  rotate={rotation}
                  key={"@" + renderScale}
                />
              ) : null}
              <Page
                key={"@" + scale}
                width={width ? width : 1}
                pageNumber={currentPage}
                scale={scale}
                rotate={rotation}
                className={cn(isLoading ? "hidden" : "")}
                loading={
                  <div className="flex justify-center">
                    <Icons.spinner className="animate-spin my-24 h-6 w-6" />
                  </div>
                }
                onRenderSuccess={() => setRenderScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}
