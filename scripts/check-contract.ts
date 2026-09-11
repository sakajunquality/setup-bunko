import assert from "node:assert/strict";

const action = Bun.YAML.parse(await Bun.file("action.yml").text()) as any;
const step = action.runs.steps[0];
assert.match(step.uses, /^sakajunquality\/bunko@[a-f0-9]{40}$/);
const sha = step.uses.split("@")[1];
const response = await fetch(`https://raw.githubusercontent.com/sakajunquality/bunko/${sha}/action.yml`);
assert.equal(response.status, 200);
const upstream = Bun.YAML.parse(await response.text()) as any;
assert.deepEqual(Object.keys(action.inputs).sort(), Object.keys(upstream.inputs).sort());
assert.deepEqual(Object.keys(step.with).sort(), Object.keys(action.inputs).sort());
for (const name of Object.keys(action.inputs)) {
  assert.equal(step.with[name], "${{ inputs." + name + " }}");
}
assert.deepEqual(Object.keys(action.outputs).sort(), Object.keys(upstream.outputs).sort());
for (const name of Object.keys(action.outputs)) {
  assert.equal(action.outputs[name].value, "${{ steps.install.outputs." + name + " }}");
}
assert.equal(action.inputs.version.default, "v0.6.2");
assert.equal(action.inputs["verify-attestation"].default, "true");
assert.equal(action.inputs["source-commit"].default, undefined);
console.log("Pinned upstream contract and all input/output forwarding verified.");
