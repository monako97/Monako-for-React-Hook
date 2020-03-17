import highLight from "highlight.js";
import markdownIt from "markdown-it";
import markdownItTocDoneRight from "markdown-it-toc-done-right";
import markdownItSup from "markdown-it-sup";
import markdownItMark from "markdown-it-mark";
import markdownItAnchor from "markdown-it-anchor";
export const markdownParser = markdownIt("default",{
    html: true,
    linkify: true,
    xhtmlOut: true,
    typographer: true,
    breaks: true,
    highlight: code => highLight.highlightAuto(code).value,
}).use(markdownItSup)
    .use(markdownItMark)
    .use(markdownItAnchor,{
        permalink: true,
        permalinkBefore: true,
        permalinkSymbol: '#'
    })
    .use(markdownItTocDoneRight,{
        format: (x, htmlEnCode) =>  {
            return `<span>${htmlEnCode(x)}</span>`;
        }
    });
