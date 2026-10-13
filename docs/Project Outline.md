# PARIS website build

* Site is built using P1
* final destination domain is (likely) `paris.jazzsequence.com`
* Site will be a real site live on the real internet
* dev site and test site will exist, live will be pointed to the domain
* deployment workflow to mirror the ci config in [jazz-nextjs](https://github.com/jazzsequence/jazz-nextjs)
* Treat this document as the primary reference for the project
* Treat all other markdown files in this folder as relevant for flavor, tone, context or, where applicable, for actual site content.
* images for the project are located in ./images
* music for the project are separated into album-name directories within ./music

## Background
PARIS is a nonbinary, fictional shock rock musician in a TTRPG campaign set in the San Francisco Bay Area in 1997 using the World of Darkness (Mage: the Ascencion / Vampire: the Masquerade) system. PARIS is a Korean-born vampire, formerly a ranking member of the Ventrue used as a diplomatic ambassador between clans. When PARIS fell in love with a Toreador named Lucien, it threatened a scandal and PARIS took that as an opportunity to break from the Camarilla and move to the United States. Lucien joined them.

Lucien paid fealty to the Prince of San Francisco once they reached the west coast whereas PARIS still wished to remain independent. Because of this conflict of interests, they could not be together.

## Now
PARIS released an EP independently that got signifigant press coverage and followed that up shortly after with a full length LP released by Interscope Records on their own Hostile Takeover boutique label. They also released a followup in the same year of B-sides and unreleased tracks that included the full EP reissue.

PARIS is a touring musician currently performing in small to mid-size (~200-2000 capacity) venues.

The public does not know -- and should not -- that PARIS is a vampire. Despite the fact that they sing about vampire culture, their goal is to dog whistle vampires with the intent of inciting rebellion against the Camarilla without actually making it look like they are doing that at all. For everyone else, "vampires" are a convenient metaphor that they weave in their lyrics to mean "the establishment" or "a monster" or even "the monster within". This is how they can continue performing without breeching the Masquerade.

## The website

The website needs to support PARIS and their music. It should be coded based on their attitudes and goals but never be overt that a) the site is supporting a fictional character and b) that PARIS is a vampire.

The website must include:  

* an editable tour page, with tour dates and venues easily added
  * a get tickets page that's linked from the tour dates with an online purchasing system but nothing wired into it. Users can then click to purchase but no funds are actually transferred. the result will take the user to a page with an e-ticket and QR code (even though QR codes are not 1997 appropriate). This is the only part of the site where suspension of disbelief is acceptable. everything else should actually function exactly as designed.
  * possibly some kind of map component as part of the event
* a lyrics directory for all of their lyrics
* a listen page where you can listen to and download their songs
* a page dedicated to their latest release, well enough
* a page that republishes the pitchfork interview in the files
* a bio page (that does not give much information about their actual background and really only focuses on their more recent music career)
* pictures should be sourced from the files and included on pages throughout the site
* I need an easy way to add new songs and the songs need to be catalogued by album

the design of the site should incorporate modern elements and be impressive to look at. it should reflect the mood and tone of the World of Darkness setting, PARIS' Ventrue background and PARIS' own Marilyn Manson meets K-Pop aesthetic. It should also be reflective of their lyrics (included in the files).

A design system should be built in storybook with an approval workflow in which designs are approved by a human reviewer in storybook before they are applied on the site.

## Questions
- songs I have are in m4a format. do they need to be mp3 to stream in a modern browser/media player?
- what other elements of contemporary music websites should be included?
- what backend is best for this site? is it better for it to be entirely in P1 or should I spin up a WordPress backend?
