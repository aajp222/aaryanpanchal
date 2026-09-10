/**
 * Runs synchronously before the page paints, so a locked chapter never flashes
 * its text and an unlocked one never flashes the gate. Same trick a theme
 * script uses. The slug comes from the URL, so one script covers every chapter.
 *
 * It fails open on purpose. If localStorage is unavailable — private windows,
 * blocked site data — the reader gets the writing rather than being permanently
 * locked out of it by a browser setting.
 */
const SCRIPT = `(function(){try{
var u=[];try{u=JSON.parse(localStorage.getItem('becoming.unlocked')||'[]')||[]}catch(e){u=null}
// null means storage is unavailable: fail open so nobody is locked out of the
// writing by a browser setting.
document.documentElement.setAttribute('data-unlocked', u===null?'*':u.join(' '));
var m=location.pathname.match(/\\/becoming\\/([^\\/]+)/);
if(!m)return;
var s=m[1];
if(!/^\\d\\d-/.test(s))return;
if(['01-stone','02-india','03-want','04-search'].indexOf(s)>=0)return;
if(u!==null&&u.indexOf(s)<0)document.documentElement.setAttribute('data-locked','');
}catch(e){}})();`;

export default function LockScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
