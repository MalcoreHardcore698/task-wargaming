export const APP_NAME = "task-wargaming";

export const APP_VERSION = "1.0.0";
export const APP_VERSION_STORAGE_KEY = `${APP_NAME}:version`;

// Base path for GitHub Pages routing
export const BASE_PATH = import.meta.env.PROD ? `/${APP_NAME}` : "/";

export const DEFAULT_ERROR_MESSAGE = "Something went wrong";
