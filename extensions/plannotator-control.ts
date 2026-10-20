import { Type } from "@earendil-works/pi-ai";
import { defineTool, type ExtensionAPI } from "@earendil-works/pi-coding-agent";

const REQUEST_CHANNEL = "plannotator:request";
const REQUEST_TIMEOUT_MS = 5_000;

type PlanMode = "idle" | "planning" | "executing";
type PlanModeResponse =
	| { status: "handled"; result: { phase: PlanMode } }
	| { status: "unavailable"; error?: string }
	| { status: "error"; error: string };

/** Ask the installed Plannotator extension to perform one documented mode action. */
export function requestPlanMode(
	pi: Pick<ExtensionAPI, "events">,
	mode: "enter" | "status",
): Promise<PlanModeResponse> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			reject(new Error(`Plannotator did not respond to plan-mode ${mode} within ${REQUEST_TIMEOUT_MS} ms. Query status after timeout/reload before retrying; entry may already have succeeded.`));
		}, REQUEST_TIMEOUT_MS);

		try {
			pi.events.emit(REQUEST_CHANNEL, {
				requestId: globalThis.crypto.randomUUID(),
				action: "plan-mode",
				payload: { mode },
				respond(response: PlanModeResponse) {
					clearTimeout(timer);
					resolve(response);
				},
			});
		} catch (error) {
			clearTimeout(timer);
			reject(error);
		}
	});
}

async function getPhase(pi: Pick<ExtensionAPI, "events">): Promise<PlanMode> {
	const response = await requestPlanMode(pi, "status");
	if (response.status !== "handled") {
		throw new Error(response.status === "unavailable"
			? "Plannotator plan mode is not available in this session."
			: `Plannotator could not report plan-mode status: ${response.error}`);
	}

	const phase = response.result?.phase;
	if (phase !== "idle" && phase !== "planning" && phase !== "executing") {
		throw new Error("Plannotator returned an invalid plan-mode status.");
	}
	return phase;
}

export default function plannotatorControlExtension(pi: ExtensionAPI): void {
	pi.registerTool(defineTool({
		name: "plannotator_control",
		label: "Plannotator Plan Mode",
		executionMode: "sequential",
		description:
			"Enter Plannotator plan mode before drafting a nontrivial implementation plan, or check its current status. Call enter separately and wait for success before dependent tools. Does not approve plans or exit plan mode; executing status alone does not prove human approval. If already executing, do not interrupt; ask the user before switching tasks.",
		parameters: Type.Object({
			action: Type.Union([
				Type.Literal("enter"),
				Type.Literal("status"),
			]),
		}),

		async execute(_toolCallId, { action }, _signal, _onUpdate, ctx) {
			if (!ctx.hasUI) {
				throw new Error("Plannotator plan mode requires an interactive Pi session.");
			}

			let phase = await getPhase(pi);
			if (action === "status") {
				return { content: [{ type: "text", text: `Plannotator plan mode is ${phase}.` }], details: { phase } };
			}

			if (phase === "planning") {
				return { content: [{ type: "text", text: "Plannotator is already in planning mode. Continue the current plan." }], details: { phase } };
			}
			if (phase === "executing") {
				return { content: [{ type: "text", text: "Plannotator is already executing a plan. This status alone does not prove human approval. Do not switch tasks or interrupt it without asking the user." }], details: { phase } };
			}

			const response = await requestPlanMode(pi, "enter");
			if (response.status !== "handled") {
				throw new Error(response.status === "unavailable"
					? "Plannotator plan mode is not available; do not draft or execute the implementation plan yet."
					: `Plannotator could not enter plan mode: ${response.error}`);
			}
			if (response.result?.phase !== "planning") {
				throw new Error("Plannotator did not enter planning mode; do not draft or execute the implementation plan yet.");
			}

			// Confirm the state through the public API before reporting success.
			phase = await getPhase(pi);
			if (phase !== "planning") {
				throw new Error(`Plannotator plan mode changed to ${phase} before planning could begin.`);
			}
			return { content: [{ type: "text", text: "Plannotator is in planning mode. Draft and submit the plan; wait for explicit approval before implementation." }], details: { phase } };
		},
	}));
}
