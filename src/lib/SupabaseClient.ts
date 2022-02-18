import { createClient } from "@supabase/supabase-js";
import type { TaskType } from "src/lib/Datetime";
import { getDate, getDateEnd } from "src/lib/Datetime";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!SUPABASE_URL) {
  throw new Error("環境変数が未定義 : env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!SUPABASE_KEY) {
  throw new Error("環境変数が未定義 : env.NEXT_PUBLIC_SUPABASE_KEY");
}

export const client = createClient(SUPABASE_URL, SUPABASE_KEY);

export type TodoType = {
  id: number;
  uid: string;
  inserted: Date;
  task: string;
  deadline: Date | null;
  isComplete: boolean;
  sortkey: number | null;
};

export const addTodo = async (
  uid: string,
  task: string,
  taskType: TaskType
) => {
  const deadline = taskType == "other" ? null : getDate(taskType);
  const { error } = await client
    .from("todos")
    .insert([{ uid: uid, task: task, deadline: deadline }]);
  if (error) {
    return false;
  } else {
    return true;
  }
};

const sortTodos = (todos: TodoType[]) =>
  todos.sort((a, b) => {
    const keyA = a.sortkey ? a.sortkey : a.id;
    const keyB = b.sortkey ? b.sortkey : b.id;
    return keyA < keyB ? -1 : 1;
  });

export const getTodo = async (taskType: TaskType) => {
  if (taskType != "other") {
    const start = getDate(taskType);
    const end = getDateEnd(taskType);
    const { data, error } = await client
      .from<TodoType>("todos")
      .select("*")
      .gte("deadline", start.toISOString())
      .lte("deadline", end.toISOString());
    if (error || !data) {
      return [];
    } else {
      return sortTodos(data);
    }
  } else {
    const { data, error } = await client
      .from<TodoType>("todos")
      .select("*")
      .is("deadline", null);
    if (error || !data) {
      return [];
    } else {
      return sortTodos(data);
    }
  }
};

export const editTodo = async (id: number, task: string) => {
  const { error } = await client
    .from("todos")
    .update({ task: task })
    .eq("id", id);

  if (error) {
    return false;
  } else {
    return true;
  }
};

export const moveTodo = async (
  todos: TodoType[],
  id: number,
  targetIndex: number
) => {
  if (targetIndex < 0 || todos.length < targetIndex) {
    return false;
  }
  let sortkey = 0;
  if (targetIndex == 0) {
    sortkey = todos[0].sortkey ? todos[0].sortkey - 0.5 : todos[0].id - 0.5;
  } else if (targetIndex == todos.length) {
    const last = todos.slice(-1)[0];
    sortkey = last.sortkey ? last.sortkey + 0.5 : last.id + 0.5;
  } else {
    const a = todos[targetIndex - 1];
    const sortkeyA = a.sortkey ? a.sortkey : a.id;
    const b = todos[targetIndex - 1];
    const sortkeyB = b.sortkey ? b.sortkey : b.id;
    sortkey = (sortkeyA + sortkeyB) / 2;
  }
  const { error } = await client
    .from("todos")
    .update({ sortkey: sortkey })
    .eq("id", id);
  if (error) {
    return false;
  } else {
    return true;
  }
};
