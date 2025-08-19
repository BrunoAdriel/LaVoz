// Mini nav

class NavComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML=`
        <nav class="custom-nav">
            <ul>
                <li><a href="/fontend/index.html">Landing</a></li>
                <li><a href="/fontend/packs/index.html">Packs</a></li>
                <li><a href="/fontend/trivia/index.html">Trivia</a></li>
            </ul>
        </nav>
        `;
    }
}
customElements.define('nav-component', NavComponent);
