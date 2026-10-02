import { mount, enableAutoUnmount, flushPromises } from '@vue/test-utils'
import { afterEach, describe, it, expect } from 'vitest'
import { ScSelect } from 'shiny-colors-ui'
import ViewerControls from '../ViewerControls.vue'
import ViewerDressSelect from '../ViewerDressSelect.vue'

enableAutoUnmount(afterEach)

describe('ViewerControls.vue', () => {
  const defaultProps = {
    idolId: 1,
    selectedDressIndex: 0,
    dressType: 'spine/idols/stand/101/',
    backgroundColor: '#000000',
    continuousShootingEnabled: false,
    idolOptions: [
      { label: 'Idol 1', value: 1 },
      { label: 'Idol 2', value: 2 },
    ],
    dressOptions: [
      {
        type: 'group' as const,
        label: 'P_SSR',
        key: 'P_SSR',
        children: [
          { label: 'Dress 1', value: 0 },
          { label: 'Unavailable dress', value: 1, disabled: true },
        ],
      },
      {
        type: 'group' as const,
        label: 'S_SR',
        key: 'S_SR',
        children: [{ label: 'Dress 2', value: 2 }],
      },
    ],
    typeOptions: [{ label: '立ち絵・通常衣装', value: 'spine/idols/stand/101/' }],
    showActionButtons: true,
  }

  it('renders selected values and named controls', async () => {
    const wrapper = mount(ViewerControls, { props: defaultProps })
    await flushPromises()
    const selects = wrapper.findAll('[role="combobox"]')
    expect(selects).toHaveLength(3)
    expect(selects[0]!.text()).toContain('Idol 1')
    expect(selects[1]!.text()).toContain('Dress 1')
    expect(selects[2]!.text()).toContain('立ち絵・通常衣装')
    expect(wrapper.get('input[type="color"]').element.getAttribute('aria-label')).toBe(
      '背景色を選択'
    )
    expect(wrapper.get('[role="switch"]').attributes('aria-checked')).toBe('false')
  })

  it('converts string selections to numeric IDs and dress indices', async () => {
    const wrapper = mount(ViewerControls, { props: defaultProps })
    const selects = wrapper.findAllComponents(ScSelect)
    selects[0]!.vm.$emit('update:modelValue', '2')
    wrapper
      .findComponent(ViewerDressSelect)
      .findComponent({ name: 'SelectRoot' })
      .vm.$emit('update:modelValue', '2')
    selects[1]!.vm.$emit('update:modelValue', 'spine/idols/cb/101/')
    await flushPromises()
    expect(wrapper.emitted('update:idol')).toEqual([[2]])
    expect(wrapper.emitted('update:dress')).toEqual([[2]])
    expect(wrapper.emitted('update:type')).toEqual([['spine/idols/cb/101/']])
  })

  it('keeps an empty idol selection from changing the current idol', async () => {
    const wrapper = mount(ViewerControls, { props: defaultProps })
    const select = wrapper.findAllComponents(ScSelect)[0]!
    select.vm.$emit('update:modelValue', undefined)
    select.vm.$emit('update:modelValue', '')
    await flushPromises()
    expect(wrapper.emitted('update:idol')).toBeUndefined()
  })

  it('preserves dress categories and disabled items in the portal', async () => {
    const wrapper = mount(ViewerDressSelect, {
      props: { modelValue: 0, groups: defaultProps.dressOptions },
      attachTo: document.body,
    })
    await wrapper.get('[role="combobox"]').trigger('pointerdown', {
      button: 0,
      ctrlKey: false,
      pointerType: 'mouse',
    })
    await flushPromises()
    const list = document.body.querySelector('[role="listbox"]')!
    expect(list.textContent).toContain('P_SSR')
    expect(list.textContent).toContain('S_SR')
    expect(list.querySelector('[role="option"][data-disabled]')!.textContent).toContain(
      'Unavailable dress'
    )
    const item = Array.from(list.querySelectorAll<HTMLElement>('[role="option"]')).find((item) =>
      item.textContent?.includes('Dress 2')
    )!
    item.dispatchEvent(
      new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'mouse' })
    )
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
  })

  it('updates colors and shooting through actual inputs', async () => {
    const wrapper = mount(ViewerControls, { props: defaultProps })
    await wrapper.get('input[type="color"]').setValue('#ff0000')
    expect(wrapper.emitted('update:backgroundColor')).toEqual([['#ff0000']])
    await wrapper.get('input[type="text"]').setValue('#12')
    expect(wrapper.emitted('update:backgroundColor')).toHaveLength(1)
    expect(wrapper.get('[role="alert"]').text()).toContain('#RRGGBB')
    await wrapper.get('input[type="text"]').setValue('#abcdef')
    expect(wrapper.emitted('update:backgroundColor')![1]).toEqual(['#abcdef'])
    await wrapper.get('[role="switch"]').trigger('click')
    expect(wrapper.emitted('update:continuousShootingEnabled')).toEqual([[true]])
    await wrapper.setProps({ backgroundColor: '#112233' })
    expect((wrapper.get('input[type="text"]').element as HTMLInputElement).value).toBe('#112233')
  })

  it('hides action buttons when showActionButtons is false', () => {
    const wrapper = mount(ViewerControls, {
      props: { ...defaultProps, showActionButtons: false },
    })
    const buttonTexts = wrapper.findAll('button').map((button) => button.text())
    expect(buttonTexts).not.toContain('リンクを共有')
    expect(buttonTexts).not.toContain('画像を保存')
    expect(buttonTexts).toContain('スペシャルサンクス')
  })

  it('emits button actions', async () => {
    const wrapper = mount(ViewerControls, { props: defaultProps })
    for (const [label, event] of [
      ['アニメーション一覧', 'openAnimation'],
      ['シャイニーカラーズDB', 'openDatabase'],
      ['スペシャルサンクス', 'openThanks'],
      ['リンクを共有', 'share'],
      ['画像を保存', 'save'],
    ]) {
      await wrapper
        .findAll('button')
        .find((button) => button.text() === label)!
        .trigger('click')
      expect(wrapper.emitted(event!)).toEqual([[]])
    }
  })
})
