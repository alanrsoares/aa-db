import { type Instance, type SnapshotIn, type SnapshotOut } from "mobx-state-tree";
declare const StatusKindModel: import("mobx-state-tree/dist/internal").IUnionType<[import("mobx-state-tree").ISimpleType<"initializing">, import("mobx-state-tree").ISimpleType<"ready">, import("mobx-state-tree").ISimpleType<"error">, import("mobx-state-tree").ISimpleType<"finished">, import("mobx-state-tree").ISimpleType<"loading">]>;
export type StatusKind = Instance<typeof StatusKindModel>;
export declare const DrivingTestStateModel: import("mobx-state-tree").IModelType<{
    statusText: import("mobx-state-tree").ISimpleType<string>;
    status: import("mobx-state-tree/dist/internal").IUnionType<[import("mobx-state-tree").ISimpleType<"initializing">, import("mobx-state-tree").ISimpleType<"ready">, import("mobx-state-tree").ISimpleType<"error">, import("mobx-state-tree").ISimpleType<"finished">, import("mobx-state-tree").ISimpleType<"loading">]>;
    progress: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
        current: import("mobx-state-tree").ISimpleType<number>;
        total: import("mobx-state-tree").ISimpleType<number>;
        percentage: import("mobx-state-tree").ISimpleType<number>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
    stats: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
        newQuestions: import("mobx-state-tree").ISimpleType<number>;
        totalQuestions: import("mobx-state-tree").ISimpleType<number>;
        questionsByCategory: import("mobx-state-tree").ISimpleType<number>;
        emptyAttempts: import("mobx-state-tree").ISimpleType<number>;
        maxEmptyAttempts: import("mobx-state-tree").ISimpleType<number>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
    lastError: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
    currentUrl: import("mobx-state-tree").ISimpleType<string>;
}, {
    setStatus(kind: StatusKind, text: string): import("mobx-state-tree").ModelInstanceTypeProps<{
        statusText: import("mobx-state-tree").ISimpleType<string>;
        status: import("mobx-state-tree/dist/internal").IUnionType<[import("mobx-state-tree").ISimpleType<"initializing">, import("mobx-state-tree").ISimpleType<"ready">, import("mobx-state-tree").ISimpleType<"error">, import("mobx-state-tree").ISimpleType<"finished">, import("mobx-state-tree").ISimpleType<"loading">]>;
        progress: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            current: import("mobx-state-tree").ISimpleType<number>;
            total: import("mobx-state-tree").ISimpleType<number>;
            percentage: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        stats: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            newQuestions: import("mobx-state-tree").ISimpleType<number>;
            totalQuestions: import("mobx-state-tree").ISimpleType<number>;
            questionsByCategory: import("mobx-state-tree").ISimpleType<number>;
            emptyAttempts: import("mobx-state-tree").ISimpleType<number>;
            maxEmptyAttempts: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        lastError: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
        currentUrl: import("mobx-state-tree").ISimpleType<string>;
    }> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        statusText: import("mobx-state-tree").ISimpleType<string>;
        status: import("mobx-state-tree/dist/internal").IUnionType<[import("mobx-state-tree").ISimpleType<"initializing">, import("mobx-state-tree").ISimpleType<"ready">, import("mobx-state-tree").ISimpleType<"error">, import("mobx-state-tree").ISimpleType<"finished">, import("mobx-state-tree").ISimpleType<"loading">]>;
        progress: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            current: import("mobx-state-tree").ISimpleType<number>;
            total: import("mobx-state-tree").ISimpleType<number>;
            percentage: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        stats: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            newQuestions: import("mobx-state-tree").ISimpleType<number>;
            totalQuestions: import("mobx-state-tree").ISimpleType<number>;
            questionsByCategory: import("mobx-state-tree").ISimpleType<number>;
            emptyAttempts: import("mobx-state-tree").ISimpleType<number>;
            maxEmptyAttempts: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        lastError: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
        currentUrl: import("mobx-state-tree").ISimpleType<string>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    setLastError(error: string | null): import("mobx-state-tree").ModelInstanceTypeProps<{
        statusText: import("mobx-state-tree").ISimpleType<string>;
        status: import("mobx-state-tree/dist/internal").IUnionType<[import("mobx-state-tree").ISimpleType<"initializing">, import("mobx-state-tree").ISimpleType<"ready">, import("mobx-state-tree").ISimpleType<"error">, import("mobx-state-tree").ISimpleType<"finished">, import("mobx-state-tree").ISimpleType<"loading">]>;
        progress: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            current: import("mobx-state-tree").ISimpleType<number>;
            total: import("mobx-state-tree").ISimpleType<number>;
            percentage: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        stats: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            newQuestions: import("mobx-state-tree").ISimpleType<number>;
            totalQuestions: import("mobx-state-tree").ISimpleType<number>;
            questionsByCategory: import("mobx-state-tree").ISimpleType<number>;
            emptyAttempts: import("mobx-state-tree").ISimpleType<number>;
            maxEmptyAttempts: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        lastError: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
        currentUrl: import("mobx-state-tree").ISimpleType<string>;
    }> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        statusText: import("mobx-state-tree").ISimpleType<string>;
        status: import("mobx-state-tree/dist/internal").IUnionType<[import("mobx-state-tree").ISimpleType<"initializing">, import("mobx-state-tree").ISimpleType<"ready">, import("mobx-state-tree").ISimpleType<"error">, import("mobx-state-tree").ISimpleType<"finished">, import("mobx-state-tree").ISimpleType<"loading">]>;
        progress: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            current: import("mobx-state-tree").ISimpleType<number>;
            total: import("mobx-state-tree").ISimpleType<number>;
            percentage: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        stats: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            newQuestions: import("mobx-state-tree").ISimpleType<number>;
            totalQuestions: import("mobx-state-tree").ISimpleType<number>;
            questionsByCategory: import("mobx-state-tree").ISimpleType<number>;
            emptyAttempts: import("mobx-state-tree").ISimpleType<number>;
            maxEmptyAttempts: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        lastError: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
        currentUrl: import("mobx-state-tree").ISimpleType<string>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    setCurrentUrl(url: string): import("mobx-state-tree").ModelInstanceTypeProps<{
        statusText: import("mobx-state-tree").ISimpleType<string>;
        status: import("mobx-state-tree/dist/internal").IUnionType<[import("mobx-state-tree").ISimpleType<"initializing">, import("mobx-state-tree").ISimpleType<"ready">, import("mobx-state-tree").ISimpleType<"error">, import("mobx-state-tree").ISimpleType<"finished">, import("mobx-state-tree").ISimpleType<"loading">]>;
        progress: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            current: import("mobx-state-tree").ISimpleType<number>;
            total: import("mobx-state-tree").ISimpleType<number>;
            percentage: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        stats: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            newQuestions: import("mobx-state-tree").ISimpleType<number>;
            totalQuestions: import("mobx-state-tree").ISimpleType<number>;
            questionsByCategory: import("mobx-state-tree").ISimpleType<number>;
            emptyAttempts: import("mobx-state-tree").ISimpleType<number>;
            maxEmptyAttempts: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        lastError: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
        currentUrl: import("mobx-state-tree").ISimpleType<string>;
    }> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        statusText: import("mobx-state-tree").ISimpleType<string>;
        status: import("mobx-state-tree/dist/internal").IUnionType<[import("mobx-state-tree").ISimpleType<"initializing">, import("mobx-state-tree").ISimpleType<"ready">, import("mobx-state-tree").ISimpleType<"error">, import("mobx-state-tree").ISimpleType<"finished">, import("mobx-state-tree").ISimpleType<"loading">]>;
        progress: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            current: import("mobx-state-tree").ISimpleType<number>;
            total: import("mobx-state-tree").ISimpleType<number>;
            percentage: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        stats: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            newQuestions: import("mobx-state-tree").ISimpleType<number>;
            totalQuestions: import("mobx-state-tree").ISimpleType<number>;
            questionsByCategory: import("mobx-state-tree").ISimpleType<number>;
            emptyAttempts: import("mobx-state-tree").ISimpleType<number>;
            maxEmptyAttempts: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        lastError: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
        currentUrl: import("mobx-state-tree").ISimpleType<string>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    setProgress(current: number, total: number): import("mobx-state-tree").ModelInstanceTypeProps<{
        statusText: import("mobx-state-tree").ISimpleType<string>;
        status: import("mobx-state-tree/dist/internal").IUnionType<[import("mobx-state-tree").ISimpleType<"initializing">, import("mobx-state-tree").ISimpleType<"ready">, import("mobx-state-tree").ISimpleType<"error">, import("mobx-state-tree").ISimpleType<"finished">, import("mobx-state-tree").ISimpleType<"loading">]>;
        progress: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            current: import("mobx-state-tree").ISimpleType<number>;
            total: import("mobx-state-tree").ISimpleType<number>;
            percentage: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        stats: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            newQuestions: import("mobx-state-tree").ISimpleType<number>;
            totalQuestions: import("mobx-state-tree").ISimpleType<number>;
            questionsByCategory: import("mobx-state-tree").ISimpleType<number>;
            emptyAttempts: import("mobx-state-tree").ISimpleType<number>;
            maxEmptyAttempts: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        lastError: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
        currentUrl: import("mobx-state-tree").ISimpleType<string>;
    }> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        statusText: import("mobx-state-tree").ISimpleType<string>;
        status: import("mobx-state-tree/dist/internal").IUnionType<[import("mobx-state-tree").ISimpleType<"initializing">, import("mobx-state-tree").ISimpleType<"ready">, import("mobx-state-tree").ISimpleType<"error">, import("mobx-state-tree").ISimpleType<"finished">, import("mobx-state-tree").ISimpleType<"loading">]>;
        progress: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            current: import("mobx-state-tree").ISimpleType<number>;
            total: import("mobx-state-tree").ISimpleType<number>;
            percentage: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        stats: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            newQuestions: import("mobx-state-tree").ISimpleType<number>;
            totalQuestions: import("mobx-state-tree").ISimpleType<number>;
            questionsByCategory: import("mobx-state-tree").ISimpleType<number>;
            emptyAttempts: import("mobx-state-tree").ISimpleType<number>;
            maxEmptyAttempts: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        lastError: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
        currentUrl: import("mobx-state-tree").ISimpleType<string>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    updateStats(updates: Partial<{
        newQuestions: number;
        totalQuestions: number;
        questionsByCategory: number;
        emptyAttempts: number;
        maxEmptyAttempts: number;
    }>): import("mobx-state-tree").ModelInstanceTypeProps<{
        statusText: import("mobx-state-tree").ISimpleType<string>;
        status: import("mobx-state-tree/dist/internal").IUnionType<[import("mobx-state-tree").ISimpleType<"initializing">, import("mobx-state-tree").ISimpleType<"ready">, import("mobx-state-tree").ISimpleType<"error">, import("mobx-state-tree").ISimpleType<"finished">, import("mobx-state-tree").ISimpleType<"loading">]>;
        progress: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            current: import("mobx-state-tree").ISimpleType<number>;
            total: import("mobx-state-tree").ISimpleType<number>;
            percentage: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        stats: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            newQuestions: import("mobx-state-tree").ISimpleType<number>;
            totalQuestions: import("mobx-state-tree").ISimpleType<number>;
            questionsByCategory: import("mobx-state-tree").ISimpleType<number>;
            emptyAttempts: import("mobx-state-tree").ISimpleType<number>;
            maxEmptyAttempts: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        lastError: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
        currentUrl: import("mobx-state-tree").ISimpleType<string>;
    }> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        statusText: import("mobx-state-tree").ISimpleType<string>;
        status: import("mobx-state-tree/dist/internal").IUnionType<[import("mobx-state-tree").ISimpleType<"initializing">, import("mobx-state-tree").ISimpleType<"ready">, import("mobx-state-tree").ISimpleType<"error">, import("mobx-state-tree").ISimpleType<"finished">, import("mobx-state-tree").ISimpleType<"loading">]>;
        progress: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            current: import("mobx-state-tree").ISimpleType<number>;
            total: import("mobx-state-tree").ISimpleType<number>;
            percentage: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        stats: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IModelType<{
            newQuestions: import("mobx-state-tree").ISimpleType<number>;
            totalQuestions: import("mobx-state-tree").ISimpleType<number>;
            questionsByCategory: import("mobx-state-tree").ISimpleType<number>;
            emptyAttempts: import("mobx-state-tree").ISimpleType<number>;
            maxEmptyAttempts: import("mobx-state-tree").ISimpleType<number>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>, [undefined]>;
        lastError: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
        currentUrl: import("mobx-state-tree").ISimpleType<string>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    reset(): void;
} & {
    readonly progressPercentage: number;
    readonly hasErrors: boolean;
    readonly isComplete: boolean;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export type DrivingTestState = Instance<typeof DrivingTestStateModel>;
export type DrivingTestStateSnapshotIn = SnapshotIn<typeof DrivingTestStateModel>;
export type DrivingTestStateSnapshotOut = SnapshotOut<typeof DrivingTestStateModel>;
export {};
