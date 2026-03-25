"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProvider = registerProvider;
exports.getProvider = getProvider;
exports.configureRegistry = configureRegistry;
exports.clearProviderCache = clearProviderCache;
const openai_1 = require("./openai");
const factories = {
    openai: (config) => new openai_1.OpenAIProvider(config),
};
let defaultProviderName;
let defaultConfig;
let providerCache = new Map();
function registerProvider(name, factory) {
    factories[name] = factory;
}
function getProvider(name) {
    const providerName = name ?? defaultProviderName ?? 'openai';
    if (providerCache.has(providerName)) {
        return providerCache.get(providerName);
    }
    const factory = factories[providerName];
    if (!factory) {
        throw new Error(`Unknown provider: ${providerName}`);
    }
    const provider = factory(defaultConfig);
    providerCache.set(providerName, provider);
    return provider;
}
function configureRegistry(options) {
    defaultProviderName = options.defaultProvider ?? process.env.DEFAULT_PROVIDER;
    defaultConfig = options.env ?? process.env;
}
function clearProviderCache() {
    providerCache.clear();
}
//# sourceMappingURL=registry.js.map