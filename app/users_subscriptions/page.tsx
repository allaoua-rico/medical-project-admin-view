"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import JUILoadingAutocomplete from "@/components/JUILoadingAutocomplete";
import SubscriptionCard from "./SubscriptionCard";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddUser from "./AddUser";
import Button from "@mui/joy/Button";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const {
    data,
    isLoading,
    mutate: mutateList,
  } = useSWR(inputValue || "noInput", fetcher);
  const [selectedSubscription, setSelectedSubscription] = useState<any>();
  const [autocompleteDisabled, setAutocompleteDisabled] = useState(false);
  const [addUpdateswitch, setAddUpdateswitch] = useState(true);

  useEffect(() => {
    if (selectedSubscription) {
      const updatedSub = data?.find((sub) => sub.id == selectedSubscription.id);
      setSelectedSubscription(updatedSub);
    }
  }, [data]);
  // console.log(data);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        {addUpdateswitch ? (
          <>
            <div className="bg-gray-400 text-black">
              <Button
                color="success"
                variant="solid"
                onClick={() => {
                  setAddUpdateswitch((prevValue) => !prevValue);
                }}
              >
                ADD USER
              </Button>
            </div>
            <JUILoadingAutocomplete
              setInputValue={setInputValue}
              disabled={autocompleteDisabled}
              label="username"
              options={data || []}
              isLoading={isLoading}
              getOptionLabel={
                (option) => option?.profiles?.username
                // + " / " + option.plan.plan_name
              }
              onChange={(event, value) => {
                setSelectedSubscription(value);
                // console.log(event, value);
              }}
            />
            <SubscriptionCard
              subscription={selectedSubscription}
              updatingSub={(isUpdating) => setAutocompleteDisabled(isUpdating)}
              mutateList={mutateList}
            />
          </>
        ) : (
          <AddUser
            setAddUpdateswitch={setAddUpdateswitch}
            setSelectedSubscription={setSelectedSubscription}
          />
        )}
      </div>
    </LocalizationProvider>
  );
}

async function fetcher(...args: string[]) {
  const [inputValue] = args;
  // const userId = fetchUserId();
  const supabase = createClient();
  try {
    let { data: subscription, error } = await (inputValue == "noInput"
      ? supabase
          .from("subscription")
          .select("*,profiles(*),plan(*),option_included(*)")
      : supabase
          .from("subscription")
          .select("*,profiles(*),plan(*),option_included(*)")
          .textSearch("profiles.username", inputValue, {
            type: "websearch",
          }));

    if (error) throw error;
    if (subscription) return subscription;
  } catch (error) {}
}

// async function fetchUserId(inputValue: string) {
//   const supabase = createClient();
//   try {
//     let { data: subscription, error } = await supabase
//       .from("subscription")
//       .select("*,profiles(*),plan(*),option_included(*)")
//       .ilike("Love More", inputValue);
//     if (error) throw error;
//     return subscription;
//   } catch (error) {
//     console.log(error);
//   }
// }
