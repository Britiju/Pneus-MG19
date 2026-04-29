// ==UserScript==
// @name         Pneus Marketplace Helper (Test Stealth)
// @namespace    http://pneus-mg19.local/
// @version      0.7.0
// @description  v0.7 — Drag-and-drop d'un fichier .txt sur le bouton, ou clic pour presse-papier. Optimisé batch 20-40 kits.
// @author       Patrick + Claude
// @match        https://www.facebook.com/marketplace/*
// @match        https://*.facebook.com/marketplace/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

/* eslint-disable no-console */

(function () {
  'use strict';

  // ============================================================
  // CONFIGURATION
  // ============================================================

  const LOG_PREFIX = '[PneusHelper]';
  const BUTTON_ID = 'pneus-helper-fab';
  const FIELD_FILL_DELAY = 250;
  const LIEU_AUTOCOMPLETE_WAIT = 800;
  const BUTTON_CHECK_INTERVAL = 1000;

  function log(...args) { console.log(LOG_PREFIX, ...args); }
  function warn(...args) { console.warn(LOG_PREFIX, ...args); }
  function error(...args) { console.error(LOG_PREFIX, ...args); }

  log('Script v0.7 démarré sur:', window.location.href);

  function isCreateOrEditPage() {
    const url = window.location.href;
    return (
      url.includes('/marketplace/create/') ||
      url.includes('/marketplace/edit/') ||
      /\/marketplace\/item\/[^/]+\/edit/.test(url)
    );
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ============================================================
  // PARSING DU TEXTE STRUCTURÉ
  // ============================================================

  function parseStructuredText(text) {
    const result = {};
    const lines = text.split(/\r?\n/);
    let inDescription = false;
    const descriptionLines = [];

    for (const line of lines) {
      if (inDescription) {
        descriptionLines.push(line);
        continue;
      }
      if (line.trim() === '') continue;
      const match = line.match(/^([A-ZÀ-Ü_]+)\s*:\s*(.*)$/);
      if (!match) continue;
      const key = match[1].trim().toUpperCase();
      const value = match[2].trim();
      if (key === 'DESCRIPTION') {
        inDescription = true;
        if (value) descriptionLines.push(value);
      } else {
        result[key] = value;
      }
    }
    if (descriptionLines.length > 0) {
      while (descriptionLines.length > 0 && descriptionLines[descriptionLines.length - 1].trim() === '') {
        descriptionLines.pop();
      }
      result.DESCRIPTION = descriptionLines.join('\n');
    }
    return result;
  }

  // ============================================================
  // RECHERCHE DE CHAMP PAR LABEL VOISIN
  // ============================================================

  function findFieldByNearbyLabel(labelTexts) {
    const labelArray = Array.isArray(labelTexts) ? labelTexts : [labelTexts];
    const labels = document.querySelectorAll('label');

    for (const labelText of labelArray) {
      const labelLower = labelText.toLowerCase().trim();

      for (const labelEl of labels) {
        const text = (labelEl.textContent || '').trim().toLowerCase();
        if (text !== labelLower && !text.startsWith(labelLower)) continue;

        let directInput = labelEl.querySelector(
          'input:not([type="hidden"]):not([type="file"]):not([type="search"]):not([type="checkbox"]), textarea'
        );
        if (directInput) {
          log(`  Champ "${labelText}" trouvé DANS le label`);
          return directInput;
        }

        let ancestor = labelEl.parentElement;
        for (let depth = 0; depth < 5 && ancestor; depth++) {
          const candidates = ancestor.querySelectorAll(
            'input:not([type="hidden"]):not([type="file"]):not([type="search"]):not([type="checkbox"]), textarea'
          );
          for (const candidate of candidates) {
            const style = window.getComputedStyle(candidate);
            if (style.display === 'none' || style.visibility === 'hidden') continue;
            log(`  Champ "${labelText}" trouvé à profondeur ${depth}`);
            return candidate;
          }
          ancestor = ancestor.parentElement;
        }
      }
    }
    return null;
  }

  // ============================================================
  // REMPLISSAGE COMPATIBLE REACT
  // ============================================================

  function setReactValue(element, value) {
    const tagName = element.tagName;
    const proto = tagName === 'TEXTAREA'
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value').set;

    element.focus();
    nativeSetter.call(element, value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  async function fillSimpleField(labelTexts, value, fieldName) {
    const field = findFieldByNearbyLabel(labelTexts);
    if (!field) {
      warn(`Champ "${fieldName}" introuvable.`);
      return false;
    }
    try {
      setReactValue(field, value);
      log(`✓ Rempli "${fieldName}" = ${String(value).slice(0, 60)}`);
      await sleep(FIELD_FILL_DELAY);
      return true;
    } catch (e) {
      error(`Erreur en remplissant "${fieldName}":`, e);
      return false;
    }
  }

  async function fillLieuField(value) {
    const field = findFieldByNearbyLabel(['Lieu', 'Location']);
    if (!field) {
      warn('Champ "LIEU" introuvable. Note: apparaît seulement après avoir choisi une catégorie.');
      return false;
    }
    try {
      setReactValue(field, value);
      log(`✓ Lieu rempli avec "${value}", attente des suggestions...`);
      await sleep(LIEU_AUTOCOMPLETE_WAIT);

      const arrowDown = new KeyboardEvent('keydown', {
        key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, which: 40, bubbles: true,
      });
      field.dispatchEvent(arrowDown);
      await sleep(200);

      const enter = new KeyboardEvent('keydown', {
        key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true,
      });
      field.dispatchEvent(enter);
      await sleep(FIELD_FILL_DELAY);

      log('✓ Suggestion Lieu validée (flèche bas + Entrée)');
      return true;
    } catch (e) {
      error('Erreur Lieu:', e);
      return false;
    }
  }

  // ============================================================
  // ORCHESTRATION
  // ============================================================

  async function fillAll(data) {
    const filled = [];
    const skipped = [];

    if (data.TITRE) {
      const ok = await fillSimpleField(['Titre', 'Title'], data.TITRE, 'TITRE');
      ok ? filled.push('TITRE') : skipped.push('TITRE');
    }

    if (data.PRIX) {
      const ok = await fillSimpleField(['Prix', 'Price'], data.PRIX, 'PRIX');
      ok ? filled.push('PRIX') : skipped.push('PRIX');
    }

    if (data.DESCRIPTION) {
      const ok = await fillSimpleField(['Description'], data.DESCRIPTION, 'DESCRIPTION');
      ok ? filled.push('DESCRIPTION') : skipped.push('DESCRIPTION');
    }

    if (data.UGS) {
      // UGS est aussi appelé SKU en anglais, et parfois "Référence" sur certains formulaires
      const ok = await fillSimpleField(['UGS', 'SKU', 'Référence', 'Reference'], data.UGS, 'UGS');
      ok ? filled.push('UGS') : skipped.push('UGS');
    }

    if (data.LIEU) {
      const ok = await fillLieuField(data.LIEU);
      ok ? filled.push('LIEU') : skipped.push('LIEU');
    }

    return { filled, skipped };
  }

  // ============================================================
  // CŒUR DU SYSTÈME : process une chaîne de texte
  // ============================================================

  async function processText(rawText, source) {
    log(`=== Début du remplissage v0.7 (source: ${source}) ===`);

    if (!rawText || rawText.trim() === '') {
      warn('Texte vide.');
      setButtonState('error', '❌ Vide');
      return;
    }

    const data = parseStructuredText(rawText);
    log('Texte parsé. Clés:', Object.keys(data).join(', '));

    if (Object.keys(data).length === 0) {
      warn('Aucune donnée parsée.');
      setButtonState('error', '❌ Format invalide');
      return;
    }

    setButtonState('loading', '⏳ Remplissage...');

    try {
      const { filled, skipped } = await fillAll(data);
      log(`=== Bilan: ${filled.length} remplis (${filled.join(', ')}), ${skipped.length} ignorés (${skipped.join(', ')}) ===`);

      if (filled.length === 0) {
        setButtonState('error', '❌ 0 rempli');
      } else if (skipped.length === 0) {
        setButtonState('success', `✓ ${filled.length} remplis`);
      } else {
        setButtonState('success', `✓ ${filled.length} OK, ${skipped.length} échecs`);
      }
    } catch (e) {
      error('Erreur globale:', e);
      setButtonState('error', '❌ Erreur (voir console)');
    }
  }

  // ============================================================
  // BOUTON FLOTTANT AVEC DRAG & DROP
  // ============================================================

  function createFloatingButton() {
    if (document.getElementById(BUTTON_ID)) return;
    if (!isCreateOrEditPage()) return;
    if (!document.body) return;

    const btn = document.createElement('button');
    btn.id = BUTTON_ID;
    btn.textContent = '📋 Glisser .txt ici (ou clic = presse-papier)';
    btn.title = 'Glisse un fichier .txt dessus, ou clique pour utiliser le presse-papier';

    Object.assign(btn.style, {
      position: 'fixed',
      // Position changée: à gauche, plus proche de la zone photos
      top: '200px',
      left: '20px',
      zIndex: '999999',
      padding: '20px 24px',
      fontSize: '13px',
      fontWeight: '600',
      background: '#1877f2',
      color: 'white',
      border: '3px dashed transparent',
      borderRadius: '12px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      maxWidth: '220px',
      lineHeight: '1.4',
      textAlign: 'center',
      transition: 'all 0.2s',
    });

    // === DRAG & DROP HANDLERS ===

    btn.addEventListener('dragenter', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.style.background = '#0d5cb6';
      btn.style.border = '3px dashed white';
      btn.style.transform = 'scale(1.05)';
      btn.textContent = '↓ Lâche le fichier ici';
    });

    btn.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
    });

    btn.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Vérifier qu'on quitte vraiment le bouton (pas un enfant)
      if (e.relatedTarget && btn.contains(e.relatedTarget)) return;
      resetButton();
    });

    btn.addEventListener('drop', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      log('=== Fichier glissé ===');

      const files = e.dataTransfer.files;
      if (!files || files.length === 0) {
        warn('Aucun fichier détecté.');
        setButtonState('error', '❌ Pas de fichier');
        return;
      }

      const file = files[0];
      log(`Fichier reçu: ${file.name} (${file.size} bytes, type: ${file.type})`);

      // Accepter .txt et fichiers sans type (souvent les .txt sur Windows)
      if (file.size > 1024 * 1024) {
        warn('Fichier trop gros (>1Mo).');
        setButtonState('error', '❌ Fichier trop gros');
        return;
      }

      setButtonState('loading', '⏳ Lecture fichier...');

      try {
        const text = await file.text();
        log(`Fichier lu: ${text.length} caractères`);
        await processText(text, `fichier ${file.name}`);
      } catch (e) {
        error('Erreur lecture fichier:', e);
        setButtonState('error', '❌ Erreur lecture');
      }
    });

    // === CLIC = PRESSE-PAPIER (rétrocompat) ===

    btn.addEventListener('click', async () => {
      log('=== Clic bouton (presse-papier) ===');
      setButtonState('loading', '⏳ Lecture presse-papier...');

      try {
        const text = await navigator.clipboard.readText();
        await processText(text, 'presse-papier');
      } catch (e) {
        error('Erreur presse-papier:', e);
        setButtonState('error', '❌ Permission refusée');
      }
    });

    document.body.appendChild(btn);
    log('Bouton flottant v0.7 créé (drag-drop activé).');
  }

  function resetButton() {
    const btn = document.getElementById(BUTTON_ID);
    if (!btn) return;
    btn.style.background = '#1877f2';
    btn.style.border = '3px dashed transparent';
    btn.style.transform = 'scale(1)';
    btn.textContent = '📋 Glisser .txt ici (ou clic = presse-papier)';
  }

  function setButtonState(state, message) {
    const btn = document.getElementById(BUTTON_ID);
    if (!btn) return;
    const colors = {
      idle: '#1877f2',
      loading: '#f59e0b',
      success: '#10b981',
      error: '#ef4444',
    };
    btn.style.background = colors[state] || colors.idle;
    btn.style.border = '3px dashed transparent';
    btn.style.transform = 'scale(1)';
    btn.textContent = message;
    if (state === 'success' || state === 'error') {
      setTimeout(resetButton, 4000);
    }
  }

  // ============================================================
  // EMPÊCHER LE NAVIGATEUR D'OUVRIR LE FICHIER SI ON RATE LE BOUTON
  // ============================================================

  // Sans ça, si tu glisses le fichier et tu rates le bouton, Chrome
  // l'ouvre dans un nouvel onglet. Très frustrant.
  function preventBrowserFileOpen() {
    window.addEventListener('dragover', (e) => {
      // Seulement bloquer si on est sur la page Marketplace
      if (isCreateOrEditPage()) {
        e.preventDefault();
      }
    }, false);
    window.addEventListener('drop', (e) => {
      if (isCreateOrEditPage()) {
        // Si le drop est ailleurs que sur le bouton ou sur la zone photos officielle
        const target = e.target;
        const btn = document.getElementById(BUTTON_ID);
        if (btn && (target === btn || btn.contains(target))) {
          // Le drop est géré par le bouton lui-même
          return;
        }
        // Si c'est sur la zone photos de Facebook, laisser passer
        // (on détecte par texte "Ajouter des photos" ou input type=file proche)
        const photoZone = target.closest('[role="button"]');
        if (photoZone && /photo|vid[ée]o/i.test(photoZone.textContent || '')) {
          return;
        }
        // Sinon, empêcher Chrome d'ouvrir le fichier
        e.preventDefault();
      }
    }, false);
  }

  // ============================================================
  // INIT
  // ============================================================

  function startPersistentCheck() {
    setInterval(() => {
      if (isCreateOrEditPage() && !document.getElementById(BUTTON_ID)) {
        createFloatingButton();
      }
    }, BUTTON_CHECK_INTERVAL);
  }

  function init() {
    log('Init v0.7');
    createFloatingButton();
    preventBrowserFileOpen();
    startPersistentCheck();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
