const path = require('path');
const { readFileSync } = require('fs');
const markdown = require('remark-parse');
const unified = require('unified');
const gitUrlParse = require('git-url-parse');
const { default: fetch } = require('node-fetch');

const { repository } = require('../package.json');
const { full_name } = gitUrlParse(repository.url);
const releasesHref = `https://api.github.com/repos/${full_name}/releases`
const GH_TOKEN = process.env.GH_TOKEN;

async function publishToGithub() {
    const changelog = readFileSync(path.resolve('./CHANGELOG.md'), { encoding: 'utf8' });
    const releases = getReleasesFromChangelog(changelog);
    const unpublishedReleases = await getUnpublishedReleases(releases);
    console.log(unpublishedReleases);

    return await publishReleasesToGithub(unpublishedReleases);
}

function getReleasesFromChangelog(changelog) {
    const changelogLines = changelog.split('\n');
    const processor = unified()
        .use(markdown, { commonmark: true });
    const mdAST = processor.parse(changelog).children;
    return mdAST
        .filter(heading =>
            heading.type === 'heading' &&
            (
                heading.children[0].type === 'link' ||
                /[0-9]*\.[0-9]*\.[0-9]*/.test(heading.children[0].value)))
        .map(({ children }) =>
            children[0].children
                ? children[0].children[0]
                : children[0])
        .map((heading, index, array) => ({
            version: `v${heading.value.split(' ')[0]}`,
            content: changelogLines.slice(heading.position.start.line - 2, (index + 1 < array.length) ? array[index + 1].position.start.line - 2 : undefined)
            }));
}

async function getUnpublishedReleases(releases) {
    const responses = await Promise.all(releases.map(async (release) => {
        const { ok } = await fetch(
            `${releasesHref}/tags/${release.version}`,
            {
                headers: {
                    'Authorization': ` token ${GH_TOKEN}`
                },
            }
        );
        return {
            release,
            ok
        };
    }));
    return responses
        .filter(({ ok }) => !ok)
        .map(({ release }) => release)
}

async function publishReleasesToGithub(releases) {
    return (await Promise.all(releases.map(release => fetch(
        releasesHref,
        {
            method: 'POST',
            headers: {
                'Authorization': ` token ${GH_TOKEN}`
            },
            body: JSON.stringify({
                tag_name: release.version,
                body: release.content.join('\n'),
            }),
        },
    )))).forEach(res => console.log(res));
}

publishToGithub();
