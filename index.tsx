import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { Todo } from "./types/todo";

const app = new Elysia()
	.use(html())
	.get("/", ({ html }) =>
		html(
			<BaseHtml>
				<body class="flex w-full h-screen justify-center items-center">
					<button
						class="rounded-xl border border-blue-500 bg-blue-400 p-4"
						hx-post="/clicked"
						hx-swap="outerHTML"
					>
						Click Me
					</button>
				</body>
			</BaseHtml>,
		),
	)
	.post("/clicked", () => (
		<div class="text-blue-600 text-2xl font-bold italic">
			I'm from the server!
		</div>
	))
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
	{ id: 1, content: "lean beth", completed: true },
	{ id: 1, content: "lean vim", completed: false },
];

const TodoItem = ({ content, completed, id }: Todo) => (
	<div class="flex flex-row space-x-3">
		<p>{content}</p>
		<input
			type="checked"
			checked={completed}
		/>
		<button class="text-red-500">X</button>
	</div>
);

const TodoList = ({ todos }: { todos: Todo[] }) => (
	<div>
		{todos.map((todo) => (
			<TodoItem {...todo} />
		))}
	</div>
);
