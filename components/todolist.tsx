import * as elements from "typed-html";
import { Todo } from "../types/todo";
import { TodoItem } from "./todoitem";

export const TodoList = ({ todos }: { todos: Todo[] }) => (
	<div>
		{todos.map((todo) => (
			<TodoItem {...todo} />
		))}
	</div>
);
