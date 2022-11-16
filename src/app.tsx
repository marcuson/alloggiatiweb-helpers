import { augmentCodesPage } from './codes/codes';
import globalCss from './style.css';
import { stylesheet } from './style.module.css';

// import CSS
document.head.append(VM.m(<style>{globalCss}</style>));
document.head.append(VM.m(<style>{stylesheet}</style>));

// init app
augmentCodesPage();
