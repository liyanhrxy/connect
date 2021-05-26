/* @flow */

import {Dedupe, ExtraErrorData} from '@sentry/integrations';
import {Integrations} from '@sentry/tracing';
import {init, setTag} from '@sentry/browser';

/* eslint-disable prefer-destructuring */
// Destructuring breaks the inlining of the environment variables
const environment = process.env.ENVIRONMENT;
const dsn = process.env.SENTRY_DSN;
const release = process.env.RELEASE;

export default function setupSentry() {
    init({
        dsn,
        debug: environment === 'development',
        environment,
        integrations: [
            new Dedupe(),
            new ExtraErrorData(),
            new Integrations.BrowserTracing(),
        ],
        release,
        tracesSampleRate: 1.0,
    });
    setTag('parent_url', (window.location !== window.parent.location)
        ? document.referrer
        : document.location.href);
}
