import * as THREE from 'three';

export function createChatBot() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const chatBot = new THREE.Mesh(geometry, material);

    return chatBot;
}
