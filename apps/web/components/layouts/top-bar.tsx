import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import UserButton from "@/components/user-button";
import useStores from "@/hooks/useStores";
import { Check, Globe, Lock, X } from "lucide-react";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
import type React from "react";
import { useState } from "react";
const TopBar = observer(() => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const { collections } = useStores();
  const [isEditing, setIsEditing] = useState(false);
  let collection;
  if (collectionId) {
    collection = collections.get(collectionId as string);
  }

  const handleNameClick = async () => {
    setIsEditing(true);
    await collections.save({
      id: collectionId,
      name: collection.name,
    });
  };

  const handleNameBlur = () => {
    setIsEditing(false);
    collection.save();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNameBlur();
    }
  };

  return (
    <div className="grid h-[60px] w-full grid-cols-3 items-center border-b border-border bg-background px-2 md:px-4">
      <div className="flex justify-start">
        <a href="/app">
          <img
            alt="Logo"
            className="block dark:hidden w-[64px] h-[48px]"
            style={{ color: "transparent" }}
            src="/logo.svg"
          />
        </a>
      </div>
      <div>
        {collection && (
          <div className="flex justify-center">
            <div className="w-fit">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={collection.name}
                    onBlur={handleNameBlur}
                    onChange={(e) => {
                      collection.updateData({
                        name: e.target.value,
                      });
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded-md px-2 py-1 bg-secondary focus:outline-none"
                    autoFocus
                  />
                  <Button
                    className="aspect-square h-6 w-6"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      handleNameBlur();
                    }}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    className="aspect-square h-6 w-6"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      setIsEditing(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={handleNameClick}
                  className="w-full flex-shrink cursor-text select-none truncate rounded-md px-2 py-1 hover:bg-secondary"
                >
                  {collection.name}
                </div>
              )}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <div className="rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground flex cursor-pointer select-none items-center gap-1 text-xs hover:bg-stone-100 mt-1.5">
                  <span className="flex items-center gap-1 align-middle">
                    <Globe className="h-3 w-3" />
                    {collection.privacy}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[360px]" align="end">
                <div className="space-y-2">
                  <div>
                    <div className="mb-2 flex items-center align-middle">
                      <div className="text-base font-bold">Privacy</div>
                    </div>
                    <div className="mb-2 text-sm text-muted-foreground">Who can view this project?</div>
                    <RadioGroup
                      value={collection.privacy}
                      onValueChange={(currentValue) => {
                        collection.save({
                          id: collectionId,
                          privacy: currentValue,
                        });
                      }}
                    >
                      <div className="divide grid gap-0 divide-y overflow-hidden rounded-md border">
                        <Label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 group flex cursor-pointer items-center gap-4 px-4 py-3 hover:bg-stone-50"
                          htmlFor="r1"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-900">
                            <Globe className="h-5 w-5" />
                          </div>
                          <div className="grid flex-1 gap-1 text-xs">
                            <p className="font-medium">Public</p>
                            <p className="text-muted-foreground">Anyone can view and fork this project</p>
                          </div>
                          <RadioGroupItem value="public" id="r1" />
                        </Label>
                        <Label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 group flex cursor-pointer items-center gap-4 px-4 py-3 hover:bg-stone-50"
                          htmlFor="r2"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-stone-900">
                            <Lock className="h-5 w-5" />
                          </div>
                          <div className="grid flex-1 gap-1 text-xs">
                            <p className="font-medium">Private</p>
                            <p className="text-muted-foreground">
                              Only users within your organization can view and fork this project
                            </p>
                          </div>
                          <RadioGroupItem value="private" id="r2" />
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <UserButton />
      </div>
    </div>
  );
});

export default TopBar;
