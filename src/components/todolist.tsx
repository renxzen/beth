import * as elements from "typed-html";
import { Todo } from "../types/todo";
import { TodoItem } from "./todoitem";
import { TodoForm } from "./todoform";

export const TodoList = ({ todos }: { todos: Todo[] }) => (
	<div>
		{todos.map((todo) => (
			<TodoItem {...todo} />
		))}
		<TodoForm />
	</div>
);
