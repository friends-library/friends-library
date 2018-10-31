// @flow
import * as React from 'react';
import styled from 'styled-components';
import {
  Pair,
  H1,
  H2,
  Para,
  Code,
  Section,
  Note,
  Snippet,
  Asciidoc,
} from '../components';

export default () => (
  <Section id="styling">
    <H1>Misc. Styling</H1>
    <H2>Definition Lists:</H2>
    <Para>
      <b>Definition lists</b> are lists of pairs, usually comprising
      a word or phrase and it's meaning. They are created by typing the
      word or phrase on one line followed by a <Code>::</Code>, then
      the definition on the next line:
    </Para>
    <Pair id="definition-list" />
    <Para>
      Definition lists <i>don't need to be strictly pairs of definitions.</i>
      {' '}Sometimes they are appropriate for a <b>group of labeled
      chunks,</b> like below:
    </Para>
    <Pair id="definition-list-alt" />

    <H2>Numbered Paragraphs:</H2>
    <Para>
      Fairly often our books will contain chunks of text that
      include <b>numbered paragraphs</b>. These paragraphs often
      begin with arabic numbers, or with words
      like <i>First</i>, or <i>Secondly</i>. When, according to our
      judgment, these paragraphs convey some kind of structural
      meaning that should be represented in the formatting, use
      the <Code>[.numbered]</Code> class, as shown below.
      The numbered class creates automatic spacing between paragraphs
      and also removes the text-indent, causing these paragraphs
      to stand out from the surrounding text.
    </Para>
    <Snippet trigger="num" expansion="[.numbered]" />
    <Pair id="numbered" emphasize={[1, 7]} />
    <Note>
      The above asciidoc snippet uses <Code>+++</Code> to <i>escape</i> the
      period. See <a href="#gotchas">Gotchas</a> for more on why.
    </Note>
    <Para>
      Frequently, numbered sections will begin with full words, which
      often <i>should be rendered with italics:</i>
    </Para>
    <Pair id="numbered-alt" />

    <H2>Centered Text:</H2>
    <Para>
      To center a paragraph, add the <Code>.centered</Code> class:
    </Para>
    <Pair id="centered" emphasize={[1]} />
    <Note>
      Use of the <Code>.centered</Code> class is generally discouraged, as it
      conveys no <i>meaning,</i> it's purely a presentational direction.
      Prefer instead other methods of adding a structural meaning
      to an element, if possible. However, sometimes we do need
      to hold our nose and add a presentational directive like this
      to achieve the formatting we want for the finished books.
    </Note>

    <H2>Empasized Text:</H2>
    <Para>
      To apply italics to an entire paragraph, add
      the <Code>.emphasized</Code> class:
    </Para>
    <Pair id="emphasized" emphasize={[1]} />
    <Note>
      As with the <Code>.centered</Code> above, try to use
      this <Code>.emphasized</Code> class sparingly, preferring classes
      and block types with structural meaning.
    </Note>

    <H2>Combining Classes:</H2>
    <Para>
      Any "classes" in asciidoc can be combined by chaining them together,
      like <Code>[.centered.emphasized]</Code>:
    </Para>
    <Pair id="centered-emphasized" emphasize={[1]} />
    <Note>
      As an example of not mis-using these presentational classes, you
      might consider the temptation to mark up a scrap of poetry using
      this method, with <Code>[.centered.emphasized]</Code>.
      Instead, use a <a href="#poetry">verse block</a>, which will
      provide both proper styling and correct semantics.
    </Note>
  </Section>
)
