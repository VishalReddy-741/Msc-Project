from collections import defaultdict, deque


class CPMEngine:
    def __init__(self, tasks, dependencies):
        self.tasks = {t["id"]: t for t in tasks}
        self.dependencies = dependencies
        self.successors = defaultdict(list)
        self.predecessors = defaultdict(list)
        self._build_graph()

    def _build_graph(self):
        for dep in self.dependencies:
            pred_id = dep["predecessor_id"]
            succ_id = dep["successor_id"]
            self.successors[pred_id].append(succ_id)
            self.predecessors[succ_id].append(pred_id)

    def _topological_sort(self):
        in_degree = {tid: 0 for tid in self.tasks}
        for dep in self.dependencies:
            in_degree[dep["successor_id"]] += 1

        queue = deque([tid for tid, deg in in_degree.items() if deg == 0])
        sorted_tasks = []

        while queue:
            current = queue.popleft()
            sorted_tasks.append(current)
            for successor in self.successors[current]:
                in_degree[successor] -= 1
                if in_degree[successor] == 0:
                    queue.append(successor)

        if len(sorted_tasks) != len(self.tasks):
            raise ValueError("Circular dependency detected in task graph.")

        return sorted_tasks

    def _forward_pass(self, sorted_tasks):
        es = {}
        ef = {}

        for tid in sorted_tasks:
            task = self.tasks[tid]
            duration = task["duration_days"]
            preds = self.predecessors[tid]

            if not preds:
                es[tid] = 0
            else:
                es[tid] = max(ef[p] for p in preds)

            ef[tid] = es[tid] + duration

        return es, ef

    def _backward_pass(self, sorted_tasks, es, ef):
        project_duration = max(ef.values()) if ef else 0
        ls = {}
        lf = {}

        for tid in reversed(sorted_tasks):
            task = self.tasks[tid]
            duration = task["duration_days"]
            succs = self.successors[tid]

            if not succs:
                lf[tid] = project_duration
            else:
                lf[tid] = min(ls[s] for s in succs)

            ls[tid] = lf[tid] - duration

        return ls, lf, project_duration

    def compute(self):
        try:
            sorted_tasks = self._topological_sort()
        except ValueError as e:
            return {"error": str(e), "tasks": [], "project_duration": 0}

        es, ef = self._forward_pass(sorted_tasks)
        ls, lf, project_duration = self._backward_pass(sorted_tasks, es, ef)

        results = []
        for tid in self.tasks:
            slack = ls[tid] - es[tid]
            results.append({
                "id": tid,
                "earliest_start": es[tid],
                "earliest_finish": ef[tid],
                "latest_start": ls[tid],
                "latest_finish": lf[tid],
                "slack": slack,
                "is_critical": slack == 0,
            })

        return {
            "tasks": results,
            "project_duration": project_duration,
            "error": None,
        }

    @staticmethod
    def validate_no_circular_dependency(tasks, dependencies, new_predecessor_id=None, new_successor_id=None):
        successors = defaultdict(list)

        for dep in dependencies:
            successors[dep["predecessor_id"]].append(dep["successor_id"])

        if new_predecessor_id and new_successor_id:
            successors[new_predecessor_id].append(new_successor_id)

        task_ids = {t["id"] for t in tasks}
        in_degree = {tid: 0 for tid in task_ids}

        for pred, succs in successors.items():
            for succ in succs:
                in_degree[succ] += 1

        queue = deque([tid for tid, deg in in_degree.items() if deg == 0])
        visited = 0

        while queue:
            current = queue.popleft()
            visited += 1
            for successor in successors[current]:
                in_degree[successor] -= 1
                if in_degree[successor] == 0:
                    queue.append(successor)

        return visited == len(task_ids)
