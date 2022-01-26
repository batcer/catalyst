import { Component, Event, EventEmitter, h, Listen, Method, Prop } from '@stencil/core';
import log from 'loglevel';

/**
 * Buttons are used for interface actions.
 *
 * @part button - The native anchor or button element.
 * @part content - The textual content of the button.
 * @part prefix - The prefix icon.
 * @part suffix - The suffix icon.
 */
@Component({
  tag: 'cat-button',
  styleUrl: 'cat-button.scss',
  shadow: true
})
export class CatButton {
  private button!: HTMLButtonElement | HTMLAnchorElement;

  /**
   * The rendering style of the button.
   */
  @Prop() appearance: 'filled' | 'outlined' | 'text' = 'filled';

  /**
   * The color palette of the button.
   */
  @Prop() color: 'primary' | 'secondary' = 'secondary';

  /**
   * The size of the button.
   */
  @Prop() size: 'xs' | 's' | 'm' | 'l' | 'xl' = 'm';

  /**
   * The name of the button, which gets paired with the button's value when
   * submitted as part of a form. Corresponds with the native HTML name
   * attribute.
   */
  @Prop() name?: string;

  /**
   * The value of the button, which gets paired with the button's name when
   * submitted as part of a form. Corresponds with the native HTML value
   * attribute.
   */
  @Prop() value?: string;

  /**
   * Specifies that the button should be disabled. A disabled button is unusable
   * and un-clickable. Corresponds with the native HTML disabled attribute.
   */
  @Prop() disabled = false;

  /**
   * Specifies that the button should be inactive. Just like a disabled button,
   * an inactive button is unusable and un-clickable. However, it retains the
   * current focus state.
   */
  @Prop() inactive = false;

  /**
   * Displays the button in a loading state with a spinner. Just like a disabled
   * button, an inactive button is unusable and un-clickable. However, it
   * retains the current focus state.
   */
  @Prop() loading = false;

  /**
   * Allows the button to submit a form.
   */
  @Prop() submit = false;

  /**
   * Ellipse overflowing button content.
   */
  @Prop() ellipsed = true;

  /**
   * Use round button edges. Defaults to false unless `iconOnly` is set.
   */
  @Prop() round?: boolean;

  /**
   * A destination to link to, rendered in the href attribute of a link.
   */
  @Prop() url?: string;

  /**
   * Specifies where to open the linked document.
   */
  @Prop() urlTarget?: '_blank' | '_self';

  /**
   * The name of an icon to be displayed in the button.
   */
  @Prop() icon?: string;

  /**
   * Hide the actual button content and only display the icon.
   */
  @Prop() iconOnly = false;

  /**
   * Display the icon as a suffix.
   */
  @Prop() iconSuffix = false;

  /**
   * Adds a unique identifier for the button. Please note that with this
   * particular component this ID is added inside the web component. If you need
   * an ID on the HTML element, use the regular `id` attribute instead.
   */
  @Prop() buttonId?: string;

  /**
   * Use this property to add an `aria-controls` attribute to the button. Use
   * the attribute to point to the unique ID of the content that the button
   * manages.
   */
  @Prop() a11yControls?: string;

  /**
   * Indicates the ID of a component that describes the button.
   */
  @Prop() a11yDescribedBy?: string;

  /**
   * Adds accessible label for the button that is only shown for screen
   * readers. Typically, this label text replaces the visible text on the
   * button for users who use assistive technology.
   */
  @Prop() a11yLabel?: string;

  /**
   * Indicates the ID of a component owned by the button.
   */
  @Prop() a11yOwns?: string;

  /**
   * Emitted when the button received focus.
   */
  @Event() catFocus!: EventEmitter<FocusEvent>;

  /**
   * Emitted when the button loses focus.
   */
  @Event() catBlur!: EventEmitter<FocusEvent>;

  @Listen('click')
  haltDisabledEvents(event: Event): void {
    if (this.disabled || this.inactive || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  componentWillRender(): void {
    if (this.isIconButton && !this.a11yLabel) {
      log.warn('[A11Y] Missing ARIA label on icon button', this);
    }
  }

  /**
   * Sets focus on the button. Use this method instead of `button.focus()`.
   *
   * @param options An optional object providing options to control aspects of
   * the focusing process.
   */
  @Method()
  async setFocus(options?: FocusOptions): Promise<void> {
    this.button.focus(options);
  }

  private get iconSize(): 'xs' | 's' | 'm' | 'l' | 'xl' {
    switch (this.size) {
      case 'xs':
        return 's';
      case 'xl':
        return 'l';
      default:
        return 'm';
    }
  }

  private get isIconButton(): boolean {
    return Boolean(this.icon) && this.iconOnly;
  }

  private get hasPrefixIcon(): boolean {
    return Boolean(this.icon) && !this.iconOnly && !this.iconSuffix;
  }

  private get hasSuffixIcon(): boolean {
    return Boolean(this.icon) && !this.iconOnly && this.iconSuffix;
  }

  private get content() {
    return [
      this.hasPrefixIcon ? (
        <cat-icon name={this.icon} size={this.iconSize} class="cat-button-prefix" part="prefix"></cat-icon>
      ) : null,
      this.isIconButton ? (
        <cat-icon name={this.icon} size={this.iconSize}></cat-icon>
      ) : (
        <span class="cat-button-content" part="content">
          <slot></slot>
        </span>
      ),
      this.hasSuffixIcon ? (
        <cat-icon name={this.icon} size={this.iconSize} class="cat-button-suffix" part="suffix"></cat-icon>
      ) : null,
      this.loading ? <cat-spinner size={this.iconSize}></cat-spinner> : null
    ];
  }

  private onFocus(event: FocusEvent) {
    this.catFocus.emit(event);
  }

  private onBlur(event: FocusEvent) {
    this.catBlur.emit(event);
  }

  render() {
    if (this.url) {
      return  (
        <a
          ref={el => (this.button = el as HTMLAnchorElement)}
          href={this.disabled ? undefined : this.url}
          target={this.urlTarget}
          aria-disabled={this.disabled ? 'true' : null}
          aria-controls={this.a11yControls}
          aria-described-by={this.a11yDescribedBy}
          aria-label={this.a11yLabel}
          aria-owns={this.a11yOwns}
          id={this.buttonId}
          part="button"
          class={{
            'cat-button': true,
            'cat-button-icon': this.isIconButton,
            'cat-button-round': this.round ?? this.isIconButton,
            'cat-button-loading': this.loading,
            'cat-button-disabled': this.disabled,
            'cat-button-ellipsed': this.ellipsed && !this.isIconButton,
            [`cat-button-${this.appearance}`]: Boolean(this.appearance),
            [`cat-button-${this.color}`]: Boolean(this.color),
            [`cat-button-${this.size}`]: Boolean(this.size)
          }}
          onFocus={this.onFocus.bind(this)}
          onBlur={this.onBlur.bind(this)}
        >
          {this.content}
        </a>
      );
    } else {
      return (
        <button
          ref={el => (this.button = el as HTMLButtonElement)}
          type={this.submit ? 'submit' : 'button'}
          name={this.name}
          value={this.value}
          disabled={this.disabled}
          aria-disabled={this.disabled ? 'true' : null}
          aria-controls={this.a11yControls}
          aria-described-by={this.a11yDescribedBy}
          aria-label={this.a11yLabel}
          aria-owns={this.a11yOwns}
          id={this.buttonId}
          part="button"
          class={{
            'cat-button': true,
            'cat-button-icon': this.isIconButton,
            'cat-button-round': this.round ?? this.isIconButton,
            'cat-button-loading': this.loading,
            'cat-button-disabled': this.disabled,
            'cat-button-ellipsed': this.ellipsed && !this.isIconButton,
            [`cat-button-${this.appearance}`]: Boolean(this.appearance),
            [`cat-button-${this.color}`]: Boolean(this.color),
            [`cat-button-${this.size}`]: Boolean(this.size)
          }}
          onFocus={this.onFocus.bind(this)}
          onBlur={this.onBlur.bind(this)}
        >
          {this.content}
        </button>
      );
    }
  }
}
