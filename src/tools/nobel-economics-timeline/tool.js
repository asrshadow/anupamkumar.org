// ============================================================
// ECONOMICS NOBEL TIMELINE — the interactive layer
//
// WHAT THIS FILE DOES
// The page already contains the whole timeline as a plain list,
// written by Tool.astro when the site was built. This file adds two
// things on top of that list:
//
//   1. PULL OUT AND PULL IN. "All decades" shows the seven decades
//      side by side with their laureates' names. "Year by year"
//      shows one decade at a time, with every year's citation and
//      explainer. Choosing a decade pulls in to it.
//
//   2. THE PANEL. Choosing any name slides a panel in from the side
//      (from the bottom on a phone) with that person's details.
//      Close, the Escape key, or a click outside slides it away.
//
// IF ANYTHING HERE FAILS, the plain list stays on the page and a
// short notice explains. The reader never loses the content.
//
// No libraries are used. Everything below is the browser's own.
// ============================================================

// ============================================================
// STEP 1 — Find the tool on the page, and read its data
// ============================================================

// The outer box of the tool. If it is not on this page, stop
// quietly: there is nothing to do.
const toolBox = document.querySelector("[data-nobel]");

if (toolBox) {
  try {
    startTimeline(toolBox);
  } catch (error) {
    // Something went wrong. Put the page back to its plain-list
    // form, show the notice the tool frame provides, and record the
    // details in the browser's developer console for whoever fixes it.
    showPlainListAgain(toolBox);
    const notice = document.querySelector("[data-tool-error]");
    if (notice) notice.hidden = false;
    console.error("Economics Nobel timeline could not start:", error);
  }
}

function startTimeline(toolBox) {
  // The details of every laureate, written into the page as JSON by
  // Tool.astro. Each entry has: id, year, name, fullName, share,
  // motivation, affiliation, born, died, age, factsUrl,
  // wikipediaUrl, and sharedWith (the ids of co-laureates).
  const laureates = JSON.parse(toolBox.querySelector("[data-laureates]").textContent);

  // A quick way to find one laureate by id, and each laureate's
  // place in time order (for the Previous and Next buttons).
  const laureateById = new Map();
  for (let position = 0; position < laureates.length; position++) {
    laureates[position].position = position;
    laureateById.set(laureates[position].id, laureates[position]);
  }

  // The parts of the page this file works with.
  const decadeBoxes = toolBox.querySelectorAll(".decade");
  const announcer = toolBox.querySelector("[data-announce]");
  const panel = toolBox.querySelector("[data-panel]");

  // ==========================================================
  // STEP 2 — Switch the page from "plain list" to "interactive"
  // Anything marked only-with-script appears; anything marked
  // only-without-script disappears.
  // ==========================================================

  for (const element of toolBox.querySelectorAll(".only-with-script")) {
    element.hidden = false;
  }
  for (const element of toolBox.querySelectorAll(".only-without-script")) {
    element.hidden = true;
  }

  // ==========================================================
  // STEP 3 — Pulling out (all decades) and pulling in (one decade)
  // ==========================================================

  // Show every decade side by side.
  function pullOut() {
    toolBox.dataset.view = "decades";
    markPressed("[data-show]", "decades", "show");
    announce("Showing all decades.");
  }

  // Show one decade, year by year. decadeStart is a number like 1970.
  function pullIn(decadeStart) {
    toolBox.dataset.view = "years";

    // Mark which decade is the current one; the page's styles hide
    // the others.
    let decadeBox = null;
    for (const box of decadeBoxes) {
      const isThisOne = box.dataset.decade === String(decadeStart);
      box.classList.toggle("is-current", isThisOne);
      if (isThisOne) decadeBox = box;
    }

    markPressed("[data-show]", "years", "show");
    markPressed("[data-decade-choice]", String(decadeStart), "decadeChoice");

    // Tell a screen reader what is now showing, e.g. "Showing the
    // 1970s year by year: 10 prizes, 13 laureates."
    const counts = decadeBox.querySelector(".decade-count").textContent.trim();
    announce(`Showing the ${decadeStart}s year by year: ${counts}.`);
  }

  // Set aria-pressed on a group of buttons so exactly one reads as
  // pressed — both to the eye and to a screen reader.
  // "datasetKey" is the name of the data- attribute holding each
  // button's value: data-show="years" is read as dataset.show.
  function markPressed(selector, chosenValue, datasetKey) {
    for (const button of toolBox.querySelectorAll(selector)) {
      const isChosen = button.dataset[datasetKey] === chosenValue;
      button.setAttribute("aria-pressed", isChosen ? "true" : "false");
    }
  }

  // Put a sentence in the hidden "live" area, which screen readers
  // read out without the reader having to move there.
  function announce(sentence) {
    announcer.textContent = sentence;
  }

  // Which decade "Year by year" opens: the one last looked at, or
  // the most recent decade if none has been chosen yet.
  let lastDecade = decadeBoxes[decadeBoxes.length - 1].dataset.decade;

  // One click handler for the whole tool, rather than one per
  // button. It looks at what was clicked and decides what to do.
  toolBox.addEventListener("click", function handleClick(event) {
    const button = event.target.closest("button");
    if (!button || !toolBox.contains(button)) return;

    // "All decades" or "Year by year".
    if (button.dataset.show === "decades") {
      pullOut();
    } else if (button.dataset.show === "years") {
      pullIn(lastDecade);
    }

    // A decade in the decade picker, or a "Pull in" button.
    const decadeChosen = button.dataset.decadeChoice || button.dataset.pullIn;
    if (decadeChosen) {
      lastDecade = decadeChosen;
      pullIn(decadeChosen);
      // After pulling in from a decade's own button, move the
      // keyboard focus to that decade's first year, so a keyboard
      // user carries on reading from where the new view starts.
      if (button.dataset.pullIn) {
        const firstYearHeading = toolBox.querySelector(`.decade[data-decade="${decadeChosen}"] .year-heading`);
        firstYearHeading.setAttribute("tabindex", "-1");
        firstYearHeading.focus();
      }
    }

    // A laureate's name, anywhere on the page.
    if (button.dataset.laureateId) {
      openPanel(button.dataset.laureateId, button);
    }
  });

  // ==========================================================
  // STEP 4 — The panel
  // ==========================================================

  // The button that opened the panel, so focus can go back to it
  // when the panel closes. A keyboard user is returned to exactly
  // where they were.
  let openedFrom = null;

  // The laureate currently shown, for Previous and Next.
  let shownLaureate = null;

  function openPanel(laureateId, fromButton) {
    fillPanel(laureateById.get(laureateId));

    // Only remember the opener when the panel was closed. Moving to
    // a co-laureate from inside the panel keeps the original.
    if (!panel.open) {
      openedFrom = fromButton;
      panel.classList.remove("is-closing");
      // showModal opens it as a "modal" dialog: the page behind
      // cannot be reached until it closes, and Escape closes it.
      panel.showModal();
    }

    // Start at the top of the panel, and put focus on the name, so
    // a screen reader announces whose details these are.
    panel.scrollTop = 0;
    const nameHeading = panel.querySelector("[data-field='name']");
    nameHeading.setAttribute("tabindex", "-1");
    nameHeading.focus();
  }

  // Write one laureate's details into the panel. Everything goes in
  // as plain text (textContent), never as HTML, so nothing in the
  // data can ever be mistaken for part of the page's code.
  function fillPanel(laureate) {
    shownLaureate = laureate;

    setText("kicker", `Economic Sciences · ${laureate.year}`);
    setText("name", laureate.name);

    // The full name only when it adds something.
    setText("full-name", laureate.fullName !== laureate.name ? laureate.fullName : "");

    setText("share", laureate.share);
    setText("motivation", `“${laureate.motivation}”`);

    // Each fact row is hidden when there is nothing to show — no
    // "Died" for a living laureate, for example.
    setRow("affiliation", laureate.affiliation);
    setRow("born", laureate.born);
    setRow("died", laureate.died);
    setRow("age", laureate.age);

    // Co-laureates, as buttons that switch the panel to them.
    const sharedList = panel.querySelector("[data-field='shared']");
    sharedList.replaceChildren();
    for (const otherId of laureate.sharedWith) {
      const other = laureateById.get(otherId);
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = other.name;
      button.addEventListener("click", function showCoLaureate() {
        openPanel(other.id, openedFrom);
      });
      item.append(button);
      sharedList.append(item);
    }
    panel.querySelector("[data-row='shared']").hidden = laureate.sharedWith.length === 0;

    // The explainer is already on the page, in that year's entry.
    // Copy its paragraphs (not its label) into the panel.
    const explainerBox = panel.querySelector("[data-field='explainer']");
    explainerBox.replaceChildren();
    const sourceExplainer = toolBox.querySelector(`[data-explainer="${laureate.year}"]`);
    if (sourceExplainer) {
      for (const paragraph of sourceExplainer.querySelectorAll("p:not(.explainer-label)")) {
        const copy = document.createElement("p");
        copy.textContent = paragraph.textContent;
        explainerBox.append(copy);
      }
    }
    panel.querySelector("[data-row='explainer']").hidden = !sourceExplainer;

    // Links out. The link text names the person, so it makes sense
    // when read on its own (§9: meaningful link text).
    setLink("facts-link", laureate.factsUrl, `${laureate.name} on nobelprize.org`);
    setLink("wikipedia-link", laureate.wikipediaUrl, `${laureate.name} on Wikipedia`);

    // Previous and Next go through every laureate in time order.
    // At either end, the button is switched off.
    panel.querySelector("[data-step='-1']").disabled = laureate.position === 0;
    panel.querySelector("[data-step='1']").disabled = laureate.position === laureates.length - 1;
  }

  // Small helpers for filling the panel.
  function setText(fieldName, text) {
    const element = panel.querySelector(`[data-field='${fieldName}']`);
    element.textContent = text;
    element.hidden = text === "";
  }

  function setRow(rowName, text) {
    panel.querySelector(`[data-field='${rowName}']`).textContent = text;
    panel.querySelector(`[data-row='${rowName}']`).hidden = !text;
  }

  function setLink(fieldName, address, text) {
    const link = panel.querySelector(`[data-field='${fieldName}']`);
    link.href = address;
    link.textContent = text;
    link.closest("li").hidden = !address;
  }

  // Close: slide the panel away, then actually close it. With
  // reduced motion switched on, the slide takes no time at all, so
  // the panel simply goes.
  //
  // The browser normally says when the slide has finished
  // ("animationend"). It does not always — a tab in the background,
  // for instance, may never run the animation — so a timer closes
  // the panel anyway shortly after the slide should have ended.
  // Whichever comes first does the closing; the other does nothing.
  const CLOSE_ANYWAY_AFTER_MILLISECONDS = 400;

  function closePanel() {
    if (!panel.open || panel.classList.contains("is-closing")) return;
    panel.classList.add("is-closing");

    let alreadyClosed = false;
    function finishClosing() {
      if (alreadyClosed) return;
      alreadyClosed = true;
      panel.classList.remove("is-closing");
      panel.close();
    }

    panel.addEventListener("animationend", finishClosing, { once: true });
    setTimeout(finishClosing, CLOSE_ANYWAY_AFTER_MILLISECONDS);
  }

  // When the panel has closed, by any route, return focus to the
  // name that opened it.
  panel.addEventListener("close", function returnFocus() {
    if (openedFrom && document.contains(openedFrom) && openedFrom.offsetParent !== null) {
      openedFrom.focus();
    }
  });

  // The Escape key. The browser would close the panel at once; this
  // swaps in the sliding close instead.
  panel.addEventListener("cancel", function slideAwayOnEscape(event) {
    event.preventDefault();
    closePanel();
  });

  // Buttons inside the panel: Close, Previous and Next.
  panel.addEventListener("click", function handlePanelClick(event) {
    // A click on the shaded area outside the panel is reported as a
    // click on the panel itself. So is a click on the panel's own
    // empty margin, which must NOT close it. Telling them apart
    // means checking whether the click fell outside the panel's
    // edges on screen.
    if (event.target === panel) {
      const edges = panel.getBoundingClientRect();
      const clickedOutside =
        event.clientX < edges.left ||
        event.clientX > edges.right ||
        event.clientY < edges.top ||
        event.clientY > edges.bottom;
      if (clickedOutside) closePanel();
      return;
    }

    const button = event.target.closest("button");
    if (!button) return;

    if (button.hasAttribute("data-close")) {
      closePanel();
    } else if (button.dataset.step) {
      const next = laureates[shownLaureate.position + Number(button.dataset.step)];
      if (next) openPanel(next.id, openedFrom);
    }
  });

  // ==========================================================
  // STEP 5 — Start pulled out, showing every decade
  // ==========================================================

  pullOut();
}

// Undo STEP 2, if the timeline failed part-way through starting:
// back to the plain list that was there before.
function showPlainListAgain(toolBox) {
  delete toolBox.dataset.view;
  for (const element of toolBox.querySelectorAll(".only-with-script")) {
    element.hidden = true;
  }
  for (const element of toolBox.querySelectorAll(".only-without-script")) {
    element.hidden = false;
  }
}
