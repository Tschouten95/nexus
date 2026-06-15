<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = Task::query()
            ->orderBy('position')
            ->get(['id', 'title', 'description', 'status', 'priority', 'position', 'due_date']);

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
        ]);
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'tasks' => ['required', 'array'],
            'tasks.*.id' => ['required', 'integer'],
            'tasks.*.status' => ['required', 'string'],
            'tasks.*.position' => ['required', 'integer'],
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['tasks'] as $row) {
                Task::where('id', $row['id'])
                    ->update([
                        'status' => $row['status'],
                        'position' => $row['position'],
                    ]);
            }
        });

        return back();
    }
}