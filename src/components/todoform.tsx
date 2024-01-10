import * as elements from "typed-html";

export const TodoForm = () => {
	// const afterRequest = { "hx-on::after-request": "this.reset()" };
	return (
		<form
			class="flex flex-row space-x-3"
			hx-post="/todos"
			hx-swap="beforebegin"
			hx-on="htmx:afterRequest:this.reset()"
		>
			<input
				type="text"
				name="content"
				class="border border-black"
			/>
			<button type="submit">Add</button>
		</form>
	);
};
