const BOGO_OFFERS = [
    {
        id: 1,
        offPercent: 30,
        offerText: 'Buy 1 Get 2',
        price: 18,
        currency: 'USD',
        buyQty: 1,
        getQty: 2,
        popularity: ""
    },
    {
        id: 2,
        offPercent: 20,
        offerText: 'Buy 2 Get 4',
        price: 36,
        currency: 'USD',
        buyQty: 2,
        getQty: 2,
        popularity: "Most Popular"
    },
    {
        id: 3,
        offPercent: 10,
        offerText: 'Buy 3 Get 6',
        price: 88,
        currency: 'USD',
        buyQty: 3,
        getQty: 3,
        popularity: ""
    }
];

const SIZES = [
    { id: 1, type: 'S' },
    { id: 2, type: 'M' },
    { id: 3, type: 'L' },
    { id: 4, type: 'XL' },
];

const COLORS = [
    { id: 1, color: 'black' },
    { id: 2, color: 'white' },
    { id: 3, color: 'red' }
];

class Discount {
    constructor() {
        this.state = {
            selectedDiscount: null,
            sizesAndColors: {}
        };
    }

    updateSizesAndColors(wrapper) {
        this.state.sizesAndColors = {};
        wrapper.querySelectorAll('.size-and-color-container').forEach((container, index) => {
            const sizeInputValue = container.querySelector('.sizes').value;
            const colorInputValue = container.querySelector('.colors').value;
            this.state.sizesAndColors[index] = {
                size: sizeInputValue,
                color: colorInputValue
            };
        });
        console.log('Updated state:', this.state);
    }

    resetActiveClasses() {
        document.querySelectorAll('.discount-option-wrapper').forEach(wrapper => {
            wrapper.querySelector('.offer-percentage').style.display = 'none';
            wrapper.querySelector('.offer-previous-price').style.display = 'none';
            wrapper.querySelector('.size-and-color-wrapper').style.display = 'none';
            wrapper.querySelector('.percentage-container').style.display = 'flex';
            wrapper.querySelector('.offer-container').classList.remove('offer-container-active');
        });
    }

    renderRadioCards() {
        const discountCtr = document.querySelector('#discountCtr');
        BOGO_OFFERS.forEach((item, index) => {
            const discountOption = document.createElement('div');
            discountOption.classList.add('discount-option-wrapper');

            const totalItems = item.buyQty + item.getQty;
            
            let SIZE_HTML = '<select class="sizes">';
            SIZES.forEach(size => {
                SIZE_HTML += `<option value="${size.type}">${size.type}</option>`;
            });
            SIZE_HTML += '</select>';

            let COLOR_HTML = '<select class="colors">';
            COLORS.forEach(color => {
                COLOR_HTML += `<option value="${color.color}">${color.color}</option>`;
            });
            COLOR_HTML += '</select>';

            let SIZE_AND_COLOR_HTML = '';
            for (let i = 0; i < totalItems; i++) {
                SIZE_AND_COLOR_HTML += `
                
                    <div class="size-and-color-container">
                        <span style="font-size: small;"># ${i + 1}</span>
                        ${SIZE_HTML}
                        ${COLOR_HTML}
                    </div>
                `;
            }

            const HTML = `
                <div class='discount-option-container'>
                    <div class="percentage-container" style="display: flex;">
                        <p style="text-align: center; margin: 0px; line-height: 1;">${item.offPercent}%</p>
                        <p style="text-align: center; margin: 0px; line-height: 1;">Off</p>
                    </div>
                    
                    <div class="offer-container">
                        <div class="price-and-radio-popularity-container">
                            <div class="radio-container">
                                <input type="radio" name="offerRadio" />
                            </div>

                            <div class="offer-details-container">
                                <div style='display: flex; max-height: 25px;'>
                                    ${item.offerText} 
                                    <div class="offer-percentage" style='display: none; color: #fff;'>
                                        <p>${item.offPercent}% Off</p>
                                    </div>
                                </div>
                                <div style='display: flex;'>
                                    ${(item.price).toFixed(2)} ${item.currency} 
                                    <span class="offer-previous-price" style='display: none;'>$ ${(item.price+50).toFixed(2)}</span>
                                </div>
                            </div>

                            <div class="popularity-container">
                                <div><span style="color:#ff6b82">${item.popularity}</span></div>
                            </div>
                        </div>

                        <div class="size-and-color-wrapper-container">
                            <div class="size-and-color-wrapper" style='display: none'>
                                ${SIZE_AND_COLOR_HTML}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            discountOption.innerHTML = HTML;
            discountCtr.appendChild(discountOption);

            // Event listener for the entire discount-option-wrapper
            discountOption.addEventListener('click', () => {
                const radioButton = discountOption.querySelector('input[type="radio"]');
                if (!radioButton.checked) {
                    radioButton.checked = true;
                    radioButton.dispatchEvent(new Event('change'));
                }
            });

            // Event listener for the radio button
            const radioButton = discountOption.querySelector('input');
            radioButton.addEventListener('change', (e) => {
                e.stopPropagation();

                // Reset all active classes
                this.resetActiveClasses();

                // Activate the clicked option
                const discountOptionWrapper = e.target.closest('.discount-option-wrapper');
                discountOptionWrapper.querySelector('.offer-percentage').style.display = 'block';
                discountOptionWrapper.querySelector('.offer-previous-price').style.display = 'block';
                discountOptionWrapper.querySelector('.size-and-color-wrapper').style.display = 'block';
                discountOptionWrapper.querySelector('.percentage-container').style.display = 'none';
                discountOptionWrapper.querySelector('.offer-container').classList.add('offer-container-active');

                // Update the state
                this.state.selectedDiscount = item;
                this.updateSizesAndColors(discountOptionWrapper.querySelector('.size-and-color-wrapper'));
                console.log(this.state);

                // Add event listeners to size and color dropdowns
                const sizeAndColorContainers = discountOptionWrapper.querySelectorAll('.size-and-color-container');
                sizeAndColorContainers.forEach((container) => {
                    container.querySelector('.sizes').addEventListener('change', () => {
                        this.updateSizesAndColors(discountOptionWrapper.querySelector('.size-and-color-wrapper'));
                    });
                    container.querySelector('.colors').addEventListener('change', () => {
                        this.updateSizesAndColors(discountOptionWrapper.querySelector('.size-and-color-wrapper'));
                    });
                });

                // Update total price
                const totalPrice = document.querySelector('#totalPrice');
                totalPrice.innerHTML = `Total: $${item.price.toFixed(2)} USD`;
            });

            // Select the first discount option on initial load
            if (index === 0) {
                radioButton.checked = true;
                radioButton.dispatchEvent(new Event('change'));
            }
        });
    }
}

const discount = new Discount();
discount.renderRadioCards();
