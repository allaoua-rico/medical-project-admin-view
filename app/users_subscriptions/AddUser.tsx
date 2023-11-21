import Button from "@mui/joy/Button";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import { createClient } from "@/utils/supabase/client";

function AddUser({
  setAddUpdateswitch,
  setSelectedSubscription,
}: {
  setAddUpdateswitch: Dispatch<SetStateAction<boolean>>;
  setSelectedSubscription: Dispatch<any>;
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [usernameForm, setUsernameForm] = useState(false);
  const [id, setId] = useState("");
  async function addUserHandler(event: FormEvent<HTMLFormElement>) {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const { email, password } = formJson;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) console.log(error);
    if (data?.user?.id) {
      setId(data?.user?.id);
      setUsernameForm(true);
    }
  }
  async function addUsernameHandler(event: FormEvent<HTMLFormElement>) {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const { username } = formJson;
    // const id = "a2395099-1a8b-484f-9029-ab6a7b6c544c";
    const { data, error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", id)
      .select();
    setLoading(false);
    if (error) console.log(error);
    if (data) {
      const sub = await insertAndFetchSubById(id);
      if (sub?.[0]) {
        setSelectedSubscription(sub[0]);
        setAddUpdateswitch((prevValue) => !prevValue);
      }
    }
  }
  return (
    <div className="flex flex-col items-center gap-y-6">
      {!usernameForm ? (
        <>
          <div className="bg-gray-400 text-black">
            <Button
              color="success"
              variant="solid"
              onClick={() => {
                setAddUpdateswitch((prevValue) => !prevValue);
              }}
            >
              Subscriptions
            </Button>
          </div>
          <form onSubmit={addUserHandler}>
            <Stack spacing={3} alignItems={"center"}>
              <Input type="email" placeholder="email" required name="email" />
              <Input
                // type="password"
                placeholder="password"
                required
                name="password"
              />
              <div className="bg-gray-400 text-black">
                <Button loading={loading} type="submit">
                  Add user
                </Button>
              </div>
            </Stack>
          </form>
        </>
      ) : (
        <form onSubmit={addUsernameHandler}>
          <Stack spacing={3} alignItems={"center"}>
            <Input
              type="username"
              placeholder="username"
              required
              name="username"
            />
            <div className="bg-gray-400 text-black">
              <Button loading={loading} type="submit">
                update username
              </Button>
            </div>
          </Stack>
        </form>
      )}
    </div>
  );
}

export default AddUser;

async function insertAndFetchSubById(...args: string[]) {
  const [user_id] = args;
  const supabase = createClient();
  try {
    let { data: subscription, error } = await supabase
      .from("subscription")
      .insert({ user_id, current_plan_id: 2 })
      .select("*,profiles(*),plan(*),option_included(*)");
    // console.log(subscription);
    if (error) throw error;
    if (subscription) return subscription;
  } catch (error) {}
}
