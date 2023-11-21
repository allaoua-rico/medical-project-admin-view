import { DateTimePicker } from "@mui/x-date-pickers";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Button from "@mui/joy/Button";
import { createClient } from "@/utils/supabase/client";
import JUISelectPlan from "./JUISelectPlan";
import JUISelectYear, { usefetchYears } from "./JUISelectYear";

function SubscriptionCard(props: Props) {
  const { subscription, updatingSub, mutateList } = props;
  const { data: years } = usefetchYears();
  const year = years?.find(
    (year) => year.id == subscription?.option_included?.[0]?.option_id
  );
  const supabase = createClient();
  const [selectedPlan, setSelectedPlan] = useState(subscription?.plan);
  const [selectedYear, setSelectedYear] = useState(year);
  const [expValue, setExpValue] = useState(dayjs(subscription?.sub_expiration));
  const [updatingSubExp, setUpdatingSubExp] = useState(false);
  const [activatePlanChange, setActivatePlanChange] = useState(false);
  const [activateYearChange, setActivateYearChange] = useState(false);

  async function handleSubExpChange(table: string, object: any, id: any) {
    setUpdatingSubExp(true);
    updatingSub(true);
    try {
      const { data, error } = await supabase
        .from(table)
        .update(object)
        .eq("id", id)
        .select();
      mutateList();
      if (error) throw error;
    } catch (error) {
    } finally {
      setUpdatingSubExp(false);
      updatingSub(false);
      setActivatePlanChange(false);
    }
  }

  useEffect(() => {
    setExpValue(dayjs(subscription?.sub_expiration));
    setSelectedPlan(subscription?.plan);
    setSelectedYear(year);
    setActivatePlanChange(false);
    setActivateYearChange(false);
  }, [subscription]);

  if (subscription?.created_at)
    return (
      <div className="flex flex-col space-y-8 text-black">
        <div className="flex items-center space-x-3">
          <div className="font-semibold">subsription_id:</div>
          <div>{subscription.id}</div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="font-semibold">username:</div>
          <div>{subscription?.profiles?.username || null}</div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="font-semibold">Created_at:</div>
          <div>
            {dayjs(subscription?.created_at).format("DD/MM/YYYY  HH:mm")}
          </div>
        </div>

        <div className=" flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="font-semibold">Plan:</div>
            {activatePlanChange ? (
              <JUISelectPlan
                subsPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
              />
            ) : (
              <div className="text-green-600">
                {subscription?.plan?.plan_name || null}
              </div>
            )}
            <Button
              loading={updatingSubExp}
              variant="outlined"
              onClick={() => {
                setActivatePlanChange(
                  (planActivateState) => !planActivateState
                );
              }}
            >
              {activatePlanChange ? "Cancel" : "Change plan"}
            </Button>
          </div>
          <Button
            loading={updatingSubExp}
            variant="outlined"
            disabled={subscription?.plan?.id == selectedPlan?.id}
            onClick={() => {
              handleSubExpChange(
                "subscription",
                {
                  current_plan_id: selectedPlan.id,
                },
                subscription.id
              );
            }}
          >
            Update
          </Button>
        </div>

        {subscription?.plan.plan_name == "externat" && (
          <div className=" flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="font-semibold">Année:</div>
              {activateYearChange ? (
                <JUISelectYear
                  subsYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                />
              ) : (
                <div className="text-blue-600">
                  {
                    years?.find(
                      (year) =>
                        year.id == subscription?.option_included?.[0]?.option_id
                    )?.option_name
                  }
                </div>
              )}
              <Button
                loading={updatingSubExp}
                variant="outlined"
                onClick={() => {
                  setActivateYearChange(
                    (yearActivateState) => !yearActivateState
                  );
                  activateYearChange &&
                    setSelectedYear(
                      years?.find(
                        (year) =>
                          year.id ==
                          subscription?.option_included?.[0]?.option_id
                      )
                    );
                }}
              >
                {activateYearChange ? "Cancel" : "Change Year"}
              </Button>
            </div>
            <Button
              loading={updatingSubExp}
              variant="outlined"
              disabled={
                subscription?.option_included?.[0]?.option_id ==
                selectedYear?.id
              }
              onClick={() => {
                handleSubExpChange(
                  "option_included",
                  {
                    option_id: selectedYear?.id,
                  },
                  subscription?.option_included?.[0]?.id
                );
                if (subscription.option_included.length == 0) {
                  console.log("here");
                  handleCreateOptionIncluded(
                    updatingSub,
                    mutateList,
                    subscription,
                    selectedYear
                  );
                }
              }}
            >
              Update
            </Button>
          </div>
        )}

        <div className=" flex items-center">
          <div className="font-semibold">Date d'éxpiration:</div>
          <DateTimePicker
            minDate={dayjs()}
            label="Date d'éxpiration"
            value={expValue}
            onChange={(newValue) => setExpValue(dayjs(newValue))}
          />
          <Button
            loading={updatingSubExp}
            variant="outlined"
            disabled={!expValue.diff(subscription?.sub_expiration, "d")}
            onClick={() =>
              handleSubExpChange(
                "subscription",
                {
                  sub_expiration: expValue.format(),
                },
                subscription.id
              )
            }
          >
            Update
          </Button>
        </div>
      </div>
    );
}

type Props = {
  subscription: any;
  updatingSub: (isUpdating: boolean) => any;
  mutateList: any;
};

export default SubscriptionCard;

async function handleCreateOptionIncluded(
  updatingSub: (isUpdating: boolean) => any,
  mutateList: any,
  subscription: any,
  selectedYear: any
) {
  const supabase = createClient();
  updatingSub(true);
  try {
    const { data, error } = await supabase
      .from("option_included")
      .insert({ subsription_id: subscription.id, option_id: selectedYear?.id })
      .eq("subsription_id", subscription.id)
      .select();
    mutateList();

    if (error) throw error;
  } catch (error) {
  } finally {
    updatingSub(false);
  }
}
