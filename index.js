document.addEventListener("DOMContentLoaded", async () => {
    if (!window.web3) {
        throw new Error(`Cannot find Web3.`);
    }
    window.web3 = new Web3(window.web3.currentProvider);

    const contractAddress = '0x7E37B56F11503d50A704725393603af67230F895';

    const resp = await fetch('./MyToken.json');
    const respJson = await resp.json();

    const contract = window.web3.eth.contract(respJson.abi).at(contractAddress);

    function getAccount() {
        return new Promise((resolve, reject) => {
            window.web3.eth.getAccounts((err, accounts) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (accounts.length === 0) {
                    resolve(null);
                    return;
                }
                const account = accounts[0];
                resolve(account);
            });
        });
    }

    let owner;

    (async () => {
        owner = await getAccount();
        $('#mint-account').val(owner);
        $('#transfer-from').val(owner);
    })();

    $('#mint').on('click', () => {
        contract.mint({ from: owner }, (err) => {
            if (err) {
                throw new Error(err);
            }
        });
    });

    $('#set-token-uri').on('click', () => {
        const tokenId = $('#set-token-uri-token-id').val();
        const message = $('#set-token-uri-message').val();
        contract.setTokenURI(tokenId, message, { from: owner }, (err) => {
            if (err) {
                throw new Error(err);
            }
        });
    });

    $('#burn').on('click', () => {
        const tokenId = $('#burn-token-id').val();
        contract.burn(tokenId, { from: owner }, (err) => {
            if (err) {
                throw new Error(err);
            }
        });
    });

    $('#transfer').on('click', () => {
        const to = $('#transfer-to').val();
        const tokenId = $('#transfer-token-id').val();
        contract.safeTransferFrom(owner, to, tokenId, { from: owner }, (err) => {
            if (err) {
                throw new Error(err);
            }
        });
    });

    function tokenURI(tokenId) {
        return new Promise((resolve, reject) => {
            contract.tokenURI(tokenId, (err, tokenURI) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(tokenURI);
            });
        });
    }

    function ownerOf(tokenId) {
        return new Promise((resolve, reject) => {
            contract.ownerOf(tokenId, (err, owner) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(owner);
            });
        });
    }

    function totalSupply() {
        return new Promise((resolve, reject) => {
            contract.totalSupply((err, totalSupply) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(totalSupply);
            });
        });
    }

    function tokenByIndex(index) {
        return new Promise((resolve, reject) => {
            contract.tokenByIndex(index, (err, tokenId) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(tokenId);
            });
        });
    }

    const tokenPromises = [];
    for (let i = await totalSupply() - 1; i >= 0; i--) {
        tokenPromises.push(new Promise(async (resolve, reject) => {
            const tokenId = await tokenByIndex(i);
            const ownerPromise = ownerOf(tokenId);
            const tokenURIPromise = tokenURI(tokenId);
            resolve({
                tokenId,
                owner: await ownerPromise,
                tokenURI: await tokenURIPromise,
            });
        }));
    }
    const tokens = await Promise.all(tokenPromises);
    for (const token of tokens) {
        const tr = $('<tr>');
        const th = $('<th>', {scope: 'row', text: token.tokenId});
        const tdOwner = $('<td>', {text: token.owner});
        const tdMessage = $('<td>', {text: token.tokenURI});
        const tdActions = $('<td>');
        if (token.owner === owner) {
            $('<a>', {href: '#', onclick: 'prepareSetTokenURI(' + token.tokenId + ')', class: 'badge badge-info', text: 'setTokenURI'}).appendTo(tdActions);
            tdActions.append(' ');
            $('<a>', {href: '#', onclick: 'prepareBurn(' + token.tokenId + ')', class: 'badge badge-danger', text: 'burn'}).appendTo(tdActions);
            tdActions.append(' ');
            $('<a>', {href: '#', onclick: 'prepareTransfer(' + token.tokenId + ')', class: 'badge badge-success', text: 'transfer'}).appendTo(tdActions);
        }
        th.appendTo(tr);
        tdOwner.appendTo(tr);
        tdMessage.appendTo(tr);
        tdActions.appendTo(tr);
        tr.appendTo('#tokens');
    }
});

function prepareSetTokenURI(tokenId) {
    $('#set-token-uri-token-id').val(tokenId);
}

function prepareBurn(tokenId) {
    $('#burn-token-id').val(tokenId);
}

function prepareTransfer(tokenId) {
    $('#transfer-token-id').val(tokenId);
}
