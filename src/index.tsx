import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { TodoList } from "./components/todolist";
import { TodoItem } from "./components/todoitem";
import { db } from "./db";
import { Todo, todos } from "./db/schema";
import { eq } from "drizzle-orm";

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
	.get("/todos", async () => {
		const data = await db.select().from(todos).all();
		return <TodoList todos={data} />;
	})
	.post(
		"/todos/toggle/:id",
		async ({ params }) => {
			// const todo = db.find((todo) => todo.id === params.id);
			const todo = await db
				.select()
				.from(todos)
				.where(eq(todos.id, params.id))
				.get();
			if (todo) {
				const newTodo = await db
					.update(todos)
					.set({ completed: !todo.completed })
					.where(eq(todos.id, params.id))
					.returning()
					.get();
				return <TodoItem {...newTodo} />;
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
		async ({ params }) => {
			await db.delete(todos).where(eq(todos.id, params.id)).run();
		},
		{
			params: t.Object({
				id: t.Numeric(),
			}),
		},
	)
	.post(
		"/todos",
		async ({ body }) => {
			if (body.content.length === 0) {
				throw new Error("Content cannot be empty");
			}

			const newTodo = await db.insert(todos).values(body).returning().get();
			return <TodoItem {...newTodo} />;
		},
		{
			body: t.Object({
				content: t.String(),
			}),
		},
	)
	.get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
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
			<script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
			<link href="/styles.css" rel="stylesheet">
		</head>
		${children}
	</html>
`;
