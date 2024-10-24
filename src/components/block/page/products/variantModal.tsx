"use client";
import { Product, Quantity } from "@/types/client/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";
import config from "@/config";
import { Card } from "@/components/ui/card";
import AddSubtract from "./addSubtract";
import { useDevice } from "@/lib/client/hooks/useDevice";

type Props = {
  onQuantityChange: (action: "increment" | "decrement", index: number, quantity: Quantity) => void;
  isOpen: boolean;
  product: Product;
  onClose: () => void;
};

function VariantModal(props: Props) {
  const { isMobile } = useDevice();

  return (
    <>
      {isMobile ? (
        <div className="lg:hidden visible">
          <Sheet open={props.isOpen} onOpenChange={props.onClose}>
            <SheetContent className="py-4 px-0" side={"bottom"}>
              <SheetHeader className="">
                <SheetTitle className="border-b border-slate-200 shadow-sm pb-4">
                  <p className="font-semibold text-sm">{props.product.name}</p>
                </SheetTitle>
              </SheetHeader>
              <SheetDescription className="flex flex-col gap-2 px-2 py-4">
                {props.product.quantities.map((quantity, index) => (
                  <Card
                    key={quantity.id}
                    className="rounded-md flex px-2 pr-4 justify-between items-center">
                    <div className="flex  justify-between items-center">
                      <div className="relative w-full flex items-center justify-center h-full max-w-[70px] max-h-[70px] md:min-w-[70px] md:min-h-[70px]">
                        {props.product.image ? (
                          <Image
                            src={`${config.directusFileDomain}/${props.product.image}`}
                            alt={props.product.name}
                            style={{
                              objectFit: "cover",
                            }}
                            className="h-full w-full"
                            width={80}
                            height={80}
                          />
                        ) : (
                          <div>Product {props.product.name} has no image</div>
                        )}
                      </div>
                      <div className="">{quantity.quantity}</div>
                    </div>
                    <p className="basis-1/3 text-center">₹{quantity.price}</p>
                    <AddSubtract
                      count={(quantity.count || 0) as number}
                      onCountUpdate={(action) => props.onQuantityChange(action, index, quantity)}
                    />
                  </Card>
                ))}
              </SheetDescription>
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <div className="hidden lg:visible">
          <Dialog open={props.isOpen} onOpenChange={props.onClose}>
            {/* <DialogTrigger>Open</DialogTrigger>  */}
            <DialogContent className="bg-slate-100">
              <DialogHeader>
                <DialogTitle>{props.product.name} Variants</DialogTitle>
                <DialogDescription className="flex flex-col gap-2">
                  {props.product.quantities.map((quantity, index) => (
                    <Card
                      key={quantity.id}
                      className="rounded-md flex px-2 pr-4 justify-between items-center">
                      <div className="flex  justify-between items-center">
                        <div className="relative w-full flex items-center justify-center h-full max-w-[70px] max-h-[70px] md:min-w-[70px] md:min-h-[70px]">
                          {props.product.image ? (
                            <Image
                              src={`${config.directusFileDomain}/${props.product.image}`}
                              alt={props.product.name}
                              style={{
                                objectFit: "cover",
                              }}
                              className="h-full w-full"
                              width={80}
                              height={80}
                            />
                          ) : (
                            <div>Product {props.product.name} has no image</div>
                          )}
                        </div>
                        <div className="">{quantity.quantity}</div>
                      </div>
                      <p className="basis-1/3 text-center">₹{quantity.price}</p>
                      <AddSubtract
                        count={(quantity.count || 0) as number}
                        onCountUpdate={(action) => props.onQuantityChange(action, index, quantity)}
                      />
                    </Card>
                  ))}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
}

export default VariantModal;
