import { useState, FC } from "react";
import { Palette } from "@phosphor-icons/react";
import { twMerge } from "tailwind-merge";

interface ColorPickerProps {
  onSelectColor: (color: string) => void;
}

export const ColorPicker: FC<ColorPickerProps> = ({ onSelectColor }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const colors: string[] = [
    "bg-mainBgColor",
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-rose-500",
  ];

  return (
    <div className="relative">
      <Palette
        size={24}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="cursor-pointer text-white hover:text-white/80 transition-all"
      />

      {isOpen && (
        <div className="border border-rose-500 origin-top-right absolute -right-12 top-full mt-2 z-20 cursor-default">
          <div
            className=" bg-columnBgColor p-2 "
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="flex">
              {colors.map((color) => (
                <div key={color}>
                  <div
                    key={`${color}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectColor(color);
                    }}
                    className={twMerge(
                      `cursor-pointer w-6 h-6  mx-1 my-1 border border-black `,
                      `${color}`
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
