"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var RegexLintRunner_1 = __importDefault(require("../RegexLintRunner"));
var runner = new RegexLintRunner_1.default([
    {
        test: 'arch-angel',
        search: /\b(A|a)rch-angel/g,
        replace: '$1rchangel',
    },
    {
        test: 'yoke-mate',
        search: /\b(Y|y)oke-mate/g,
        replace: '$1okemate',
    },
    {
        test: 'back-yard',
        search: /\b(B|b)ack-yard/g,
        replace: '$1ackyard',
    },
    {
        test: 'grave-yard',
        search: /\b(G|g)rave-yard/g,
        replace: '$1raveyard',
    },
    {
        test: 'ware-house',
        search: /\b(W|w)are-house/g,
        replace: '$1arehouse',
    },
    {
        test: 'grand-children',
        search: /\b(G|g)rand-child/g,
        replace: '$1randchild',
    },
    {
        test: 'fellow-',
        search: /\b(F|f)ellow-(creature|servant|traveller)(s)?\b/g,
        replace: '$1ellow $2$3',
    },
    {
        test: 'heavy-laden',
        search: /\b(H|h)eavy-laden\b/g,
        replace: '$1eavy laden',
    },
    {
        test: '-hearted',
        search: /\b((F|f)aint|(B|b)roken|(L|l)ight)-hearted\b/g,
        replace: '$1hearted',
    },
    {
        test: 'judgment-seat',
        search: /\b(J|j)udgment-seat\b/g,
        replace: '$1udgment seat',
    },
    {
        test: 'Zion-ward',
        search: /\bZion-ward(s)?\b/g,
        replace: 'Zionward$1',
    },
    {
        test: 'holy-days',
        search: /\b(H|h)oly-days\b/g,
        replace: '$1oly days',
    },
    {
        test: 'worship-house',
        search: /\b(W|w)orship-house(s)?\b/g,
        replace: '$1orship house$2',
    },
    {
        test: 'inn-keeper',
        search: /\b(I|i)nn-keeper(s)?\b/g,
        replace: '$1nnkeeper$2',
    },
    {
        test: 'dining-room',
        search: /\b(D|d)ining-room(s)?\b/g,
        replace: '$1ining room$2',
    },
    {
        test: 're-establish',
        search: /\b(R|r)e-establish(ed|ment|ing)?\b/g,
        replace: '$1eestablish$2',
    },
    {
        test: '-minded',
        search: /\b((S|s)piritually|(R|r)eligiously)-minded\b/g,
        replace: '$1 minded',
    },
    {
        test: 'hope-well',
        search: /\bHope-well\b/g,
        replace: 'Hopewell',
    },
    {
        test: 'loving-kindness',
        search: /\b(L|l)oving-kindness\b/g,
        replace: '$1ovingkindness',
    },
    {
        test: 'to-day',
        search: /\b(T|t)o-day\b/g,
        replace: '$1oday',
    },
    {
        test: 'to-morrow',
        search: /\b(T|t)o-morrow\b/g,
        replace: '$1omorrow',
    },
    {
        test: 'sun-set',
        search: /\b(S|s)un-set(s)?\b/g,
        replace: '$1unset$2',
    },
    {
        test: 'road-side',
        search: /\b(R|r)oad-side(s)?\b/g,
        replace: '$1oadside$2',
    },
    {
        test: 'day-time',
        search: /\b(D|d)ay-time(s)?\b/g,
        replace: '$1aytime$2',
    },
    {
        test: 'death-bed',
        search: /\b(D|d)eath-bed(s)?\b/g,
        replace: '$1eathbed$2',
    },
    {
        test: 'anti-christ',
        search: /\b(A|a)nti-(C|c)hrist\b/g,
        replace: '$1ntichrist',
    },
    {
        test: 're-enter',
        search: /\b(R|r)e-enter(s|ed)?\b/g,
        replace: '$1eenter$2',
    },
    {
        test: 're-embark',
        search: /\b(R|r)e-embark(s|ed|ing|ation)?\b/g,
        replace: '$1eembark$2',
    },
    {
        test: 're-examin',
        search: /\b(R|r)e-examin(ing|ed|e|ation)\b/g,
        replace: '$1eexamin$2',
    },
    {
        test: 'pre-eminen',
        search: /(P|p)re-eminen(ce|t|tly)/g,
        replace: '$1reeminen$2',
    },
    {
        test: 'slave-holder',
        search: /\b(S|s)lave-holder(s)?\b/g,
        replace: '$1laveholder$2',
    },
    {
        test: 'co-operat',
        search: /\b(C|c)o-operat(e|ing|ed|ion|es)\b/g,
        replace: '$1ooperat$2',
    },
    {
        test: 'bed-side',
        search: /\b(B|b)ed-side(s)?\b/g,
        replace: '$1edside$2',
    },
]);
var rule = function (line, lines, lineNumber, lintOptions) {
    if (lintOptions.lang !== 'en') {
        return [];
    }
    return runner.getLineLintResults(line, lineNumber, lintOptions);
};
rule.slug = 'unhyphened-words';
runner.rule = rule.slug;
exports.default = rule;