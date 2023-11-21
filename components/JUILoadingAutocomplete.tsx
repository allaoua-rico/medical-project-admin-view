import * as React from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Autocomplete from "@mui/joy/Autocomplete";
import CircularProgress from "@mui/joy/CircularProgress";

export default function JUILoadingAutocomplete({
  label,
  isLoading,
  options,
  getOptionLabel,
  onChange,
  disabled,
  setInputValue,
}: {
  label?: string;
  isLoading: boolean;
  options: any[];
  getOptionLabel: (option: any) => string;
  onChange: OnChangeType;
  disabled: boolean;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <FormControl id={label}>
      <FormLabel>{label}</FormLabel>
      <Autocomplete
        disabled={disabled}
        sx={{ width: 300 }}
        placeholder={label}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={getOptionLabel}
        options={options}
        loading={isLoading}
        endDecorator={
          isLoading ? (
            <CircularProgress
              size="sm"
              sx={{ bgcolor: "background.surface" }}
            />
          ) : null
        }
        onChange={onChange}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
      />
    </FormControl>
  );
}
type OnChangeType =
  | ((
      event: React.SyntheticEvent<Element, Event>,
      value: any,
      reason: AutocompleteChangeReason
      //   details?: AutocompleteChangeDetails<any> | undefined
    ) => void)
  | undefined;

type AutocompleteChangeReason = /*unresolved*/ any;
