import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Button from "@mui/joy/Button";
import useSWR from "swr";

export default function JUISelectYear({
  subsYear,
  setSelectedYear,
}: {
  subsYear: any;
  setSelectedYear: React.Dispatch<any>;
}) {
  const { data: years, error, isLoading, mutate } = usefetchYears();
  //   const supabase = createClient();
  //   const [years, setYears] = useState<any[]>();
  //   const [loading, setLoading] = useState(true);
  //   useEffect(() => {
  //     async function fetcher() {
  //       try {
  //         let { data: year, error } = await supabase.from("option").select("*");
  //         if (error) throw error;
  //         if (year) setYears(year);
  //       } catch (error) {
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //     fetcher();
  //   }, []);
// console.log(subsYear?.id)
  if (isLoading) return <Button loading variant="plain"></Button>;
  if (years)
    return (
      <Select
        onChange={(e, v) => {
          const selectedYear = years.find((year) => year.id == v);
          setSelectedYear(selectedYear);
        }}
        placeholder="Years"
        defaultValue={subsYear?.id}
      >
        {years?.map((year) => (
          <Option key={year.id} value={year.id}>
            {year.option_name}
          </Option>
        ))}
      </Select>
    );
}

export function usefetchYears() {
  const supabase = createClient();
  async function fetcher() {
    try {
      let { data: year, error } = await supabase.from("option").select("*");
      if (error) throw error;
      if (year) return year;
    } catch (error) {
    } finally {
    }
  }

  return useSWR("/", fetcher);
}
