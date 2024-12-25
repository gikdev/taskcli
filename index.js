const fs = require("node:fs");
const [, , ...inputs] = process.argv;

function generateRandomHexID() {
	let hexID = "";
	const characters = "0123456789abcdef";

	for (let i = 0; i < 3; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		hexID += characters[randomIndex];
	}

	return hexID;
}

class Task {
	constructor(desc, status) {
		this.id = generateRandomHexID();
		this.desc = desc;
		this.status = status;
		this.createdAt = new Date();
		this.updatedAt = null;
	}
}

class JSONDB {
	constructor(filePath = "./db.json") {
		this.filePath = filePath;
		const exists = fs.existsSync(this.filePath);
		if (!exists) fs.writeFileSync(this.filePath, "[]");
	}

	write(stuff) {
		fs.writeFileSync(this.filePath, JSON.stringify(stuff));
	}

	read() {
		return JSON.parse(fs.readFileSync(this.filePath));
	}
}

function main() {
	const tasksDB = new JSONDB();

	const [, _1, _2, _3, _4] = inputs;

	const command = inputs[0];
	if (["a", "add"].includes(command)) {
		if (!_1) return console.log("Plz provide a name to make the task!");

		const tasks = tasksDB.read();

		const newTask = new Task(_1, "todo");

		tasks.push(newTask);

		tasksDB.write(tasks);

		console.log(`Task added successfully (ID: ${newTask.id})`);
	}

	if (["u", "update"].includes(command)) {
		if (!_1)
			return console.log("Provide an ID so I know what to update! ¯\\_(ツ)_/¯");

		if (!_2) return console.log("Provide sth for me to edit the task!");

		const targetId = _1.toLowerCase();

		let tasks = tasksDB.read();

		const isFound = tasks.find((t) => t.id === targetId);
		if (!isFound)
			return console.error(`No task with ID \`${targetId}\` found!`);

		tasks = tasks.map((t) =>
			t.id === targetId
				? {
						...t,
						desc: _2,
						updatedAt: new Date(),
					}
				: t,
		);

		tasksDB.write(tasks);

		console.log(`Task edited successfully (ID: ${targetId})`);
	}

	if (["d", "delete"].includes(command)) {
		if (!_1)
			return console.log("Provide an ID so I know what to delete! ¯\\_(ツ)_/¯");

		const targetId = _1.toLowerCase();

		let tasks = tasksDB.read();

		const isFound = tasks.find((t) => t.id === targetId);
		if (!isFound)
			return console.error(`No task with ID \`${targetId}\` found!`);

		tasks = tasks.filter((t) => t.id !== targetId);

		tasksDB.write(tasks);

		console.log(`Task deleted successfully (ID: ${targetId})`);
	}

	if (["mt", "mark-todo"].includes(command)) {
		if (!_1)
			return console.log("Provide an ID so I know what to update! ¯\\_(ツ)_/¯");

		const targetId = _1.toLowerCase();

		let tasks = tasksDB.read();

		const isFound = tasks.find((t) => t.id === targetId);
		if (!isFound)
			return console.error(`No task with ID \`${targetId}\` found!`);

		tasks = tasks.map((t) =>
			t.id === targetId
				? {
						...t,
						status: "todo",
						updatedAt: new Date(),
					}
				: t,
		);

		tasksDB.write(tasks);

		console.log(`Task edited successfully (ID: ${targetId})`);
	}

	if (["mip", "mark-in-progress"].includes(command)) {
		if (!_1)
			return console.log("Provide an ID so I know what to update! ¯\\_(ツ)_/¯");

		const targetId = _1.toLowerCase();

		let tasks = tasksDB.read();

		const isFound = tasks.find((t) => t.id === targetId);
		if (!isFound)
			return console.error(`No task with ID \`${targetId}\` found!`);

		tasks = tasks.map((t) =>
			t.id === targetId
				? {
						...t,
						status: "in-progress",
						updatedAt: new Date(),
					}
				: t,
		);

		tasksDB.write(tasks);

		console.log(`Task edited successfully (ID: ${targetId})`);
	}

	if (["md", "mark-done"].includes(command)) {
		if (!_1)
			return console.log("Provide an ID so I know what to update! ¯\\_(ツ)_/¯");

		const targetId = _1.toLowerCase();

		let tasks = tasksDB.read();

		const isFound = tasks.find((t) => t.id === targetId);
		if (!isFound)
			return console.error(`No task with ID \`${targetId}\` found!`);

		tasks = tasks.map((t) =>
			t.id === targetId
				? {
						...t,
						status: "done",
						updatedAt: new Date(),
					}
				: t,
		);

		tasksDB.write(tasks);

		console.log(`Task edited successfully (ID: ${targetId})`);
	}

	if (["l", "list"].includes(command)) {
		let tasks = tasksDB.read();

		if (!tasks.length) return console.log("No tasks for now! :)");

		if (_1) {
			if (!["done", "d", "t", "todo", "in-progress", "i"].includes(_1))
				return console.log(
					"Not a valid status: done (d) OR todo (t) OR in-progress (i)",
				);

			if (["d", "done"].includes(_1)) {
				tasks = tasks.filter((t) => t.status === "done");
			}

			if (["t", "todo"].includes(_1)) {
				tasks = tasks.filter((t) => t.status === "todo");
			}

			if (["i", "in-progress"].includes(_1)) {
				tasks = tasks.filter((t) => t.status === "in-progress");
			}
		}

		console.log(`TASKS (count: ${tasks.length})\n`);

		for (const task of tasks) {
			const done = (() => {
				if (task.status === "done") return "x";
				if (task.status === "in-progress") return "o";
				return " ";
			})();
			const created = new Date(task.createdAt).toLocaleDateString();
			const updated = task.updatedAt
				? new Date(task.updatedAt).toLocaleDateString()
				: "-";

			console.log(`#${task.id} [${done}] - ${task.desc}
  created at: ${created}
  updated at: ${updated}
`);
		}
	}

	if (
		[
			"h",
			"-h",
			"--help",
			"help",
			"v",
			"-v",
			"--version",
			"version",
			"--about",
			"about",
		].includes(command)
	) {
		console.log("This is a task management CLI app!");
	}
}

main();
