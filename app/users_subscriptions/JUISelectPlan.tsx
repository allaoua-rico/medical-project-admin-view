import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Button from "@mui/joy/Button";

export default function JUISelectPlan({
  subsPlan,
  setSelectedPlan,
}: {
  subsPlan: any;
  setSelectedPlan: React.Dispatch<any>;
}) {
  const supabase = createClient();
  const [plans, setPlans] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetcher() {
      try {
        let { data: plan, error } = await supabase.from("plan").select("*");
        if (error) throw error;
        if (plan) setPlans(plan);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    fetcher();
  }, []);
  if (loading) return <Button loading variant="plain"></Button>;
  if (plans)
    return (
      <Select
        onChange={(e, v) => {
          const selectedPlan = plans.find((plan) => plan.id == v);
          setSelectedPlan(selectedPlan);
        }}
        placeholder="Plan"
        defaultValue={subsPlan?.id}
      >
        {plans?.map((plan) => (
          <Option key={plan.id} value={plan.id}>
            {plan.plan_name}
          </Option>
        ))}
      </Select>
    );
}
