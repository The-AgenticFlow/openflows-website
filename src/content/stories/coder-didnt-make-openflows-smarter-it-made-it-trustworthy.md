---
title: Coder Didn't Make OpenFlows Smarter. It Made It Trustworthy.
category: Design
date: 2026-08-11
href: https://medium.com/@yemelechristian2/coder-didnt-make-openflows-smarter-it-made-it-trustworthy-f50e20b99fe0?sharedUserId=yemelechristian2
image: https://miro.medium.com/v2/resize:fit:4800/format:webp/1*V9PWI_-kjm2QOJmGjz6MMg.png
---
## The Gap Between a Demo and a Platform

>
An orchestrator is only as trustworthy as the runtime underneath it. Coder gave OpenFlows that runtime - and it changed what OpenFlows could promise.
>

AI coding demos are easy: prompt in, PR out. What's hard is everything the demo skips past - where the agent ran, what it could see, what happens when two agents touch the same file, what happens when the process dies mid-task, and whose name is actually on the merge.
That gap is an infrastructure problem, not an intelligence problem. OpenFlows was never built to solve it. OpenFlows was built to solve a harder, more specific problem: how do you get five specialized agents to work like an engineering team instead of five copies of the same assistant working in parallel?
Coder solves the infrastructure problem - Terraform-defined workspaces, a control plane that holds the model keys, per-workspace network isolation, identity and audit built in from the start. It's the piece OpenFlows was always missing, and the piece most "multi-agent" projects never build, which is why so few of them survive contact with a real engineering org.
Putting OpenFlows on top of Coder instead of next to it turned out to change more than we expected.


[Full Read](https://medium.com/@yemelechristian2/coder-didnt-make-openflows-smarter-it-made-it-trustworthy-f50e20b99fe0)
