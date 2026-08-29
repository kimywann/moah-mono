import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { type ReactElement, useState } from "react";
import MHIcon from "./MHIcon";

export interface IMHDropdownOption<TValue extends string> {
  label: string;
  value: TValue;
}

interface IMHDropdownProps<TValue extends string> {
  options: IMHDropdownOption<TValue>[];
  onChange: (value: TValue) => void;
  trigger: (isOpen: boolean) => ReactElement;
  value: TValue;
}

const MHDropdown = <TValue extends string>({
  onChange,
  options,
  trigger,
  value,
}: IMHDropdownProps<TValue>) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu.Root onOpenChange={setIsOpen} open={isOpen}>
      <DropdownMenu.Trigger asChild>{trigger(isOpen)}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          className="z-50 min-w-32 rounded-small border border-neutral10 bg-background p-1 text-foreground shadow-lg"
          sideOffset={4}
        >
          <DropdownMenu.RadioGroup
            value={value}
            onValueChange={(nextValue) => {
              const selectedOption = options.find(
                (option) => option.value === nextValue,
              );

              if (selectedOption) {
                onChange(selectedOption.value);
              }
            }}
          >
            {options.map((option) => (
              <DropdownMenu.RadioItem
                className="display14 regular relative flex cursor-pointer select-none items-center rounded-tiny py-2 pr-8 pl-3 outline-none data-[highlighted]:bg-muted"
                key={option.value}
                value={option.value}
              >
                {option.label}
                <DropdownMenu.ItemIndicator className="absolute right-3">
                  <MHIcon icon="check" size={14} />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default MHDropdown;
