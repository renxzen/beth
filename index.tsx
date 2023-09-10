import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { Todo } from "./types/todo";
import { TodoList } from "./components/todolist";
import { TodoItem } from "./components/todoitem";

const app = new Elysia()
	.use(html())
	.get("/", ({ html }) =>
		html(
			<BaseHtml>
				<body class="flex flex-col gap-5 w-full h-screen justify-center items-center">
					<div
						hx-post="/onload"
						hx-trigger="load"
						hx-swap="innerHTML"
					></div>
					<button
						class="rounded-xl border border-blue-500 bg-blue-400 p-4"
						hx-get="/todos"
						hx-swap="outerHTML"
					>
						Show todos
					</button>
				</body>
			</BaseHtml>,
		),
	)
	.post("/onload", () => (
		<div class="text-blue-600 text-2xl font-bold italic">
			Welcome to the todos list!
		</div>
	))
	.get("/todos", () => <TodoList todos={db} />)
	.post(
		"/todos/toggle/:id",
		({ params }) => {
			const todo = db.find((todo) => todo.id === params.id);
			if (todo) {
				todo.completed = !todo.completed;
				return <TodoItem {...todo} />;
			}
		},
		{
			params: t.Object({
				id: t.Numeric(),
			}),
		},
	)
	.delete(
		"/todos/:id",
		({ params }) => {
			const todo = db.find((todo) => todo.id === params.id);
			if (todo) {
				db.splice(db.indexOf(todo), 1);
			}
		},
		{
			params: t.Object({
				id: t.Numeric(),
			}),
		},
	)
	.listen(3000);

console.log(
	`Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);

const BaseHtml = ({ children }: elements.Children) => `
	<!doctype html>
	<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1"
			/>
			<title>THE BETH STACK</title>
			<script src="https://unpkg.com/htmx.org@1.9.5"></script>
			<script src="https://cdn.tailwindcss.com"></script>
		</head>
		${children}
	</html>
`;

const db: Todo[] = [
	{ id: 1, content: "learn beth", completed: true },
	{ id: 2, content: "learn vim", completed: false },
];
