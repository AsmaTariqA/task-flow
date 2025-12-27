"use server";

import { createClient } from "@/lib/supabase/server";

export async function getTasks(projectId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createTask(projectId: string, title: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .insert({ title, project_id: projectId })
    .select()
    .single();

  if (error) throw error;
  return data;
}
